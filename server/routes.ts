import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

type RapidApiImageResponse = unknown;

function pickFirstString(value: any): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    const first = value.find((v) => typeof v === "string");
    return typeof first === "string" ? first : undefined;
  }
  return undefined;
}

function extractBase64Images(payload: RapidApiImageResponse): { mimeType: string; dataBase64: string }[] {
  const p: any = payload;

  // Try common shapes without assuming exact provider schema.
  const candidates: any[] = [];

  // { data: [ { b64_json }, ... ] } or { data: [ { url } ... ] }
  if (Array.isArray(p?.data)) candidates.push(...p.data);
  // { images: [ ... ] }
  if (Array.isArray(p?.images)) candidates.push(...p.images);
  // { result: { images: [...] } }
  if (Array.isArray(p?.result?.images)) candidates.push(...p.result.images);
  // { output: [...] }
  if (Array.isArray(p?.output)) candidates.push(...p.output);

  const images: { mimeType: string; dataBase64: string }[] = [];

  for (const c of candidates) {
    if (!c) continue;

    // OpenAI-like: { b64_json: "..." }
    const b64 = pickFirstString(c?.b64_json) ?? pickFirstString(c?.base64) ?? pickFirstString(c?.b64);
    if (b64) {
      images.push({ mimeType: "image/png", dataBase64: b64 });
      continue;
    }

    // Data URL: "data:image/png;base64,..."
    const dataUrl = pickFirstString(c?.data_url) ?? (typeof c === "string" && c.startsWith("data:") ? c : undefined);
    if (dataUrl) {
      const match = /^data:(.+?);base64,(.+)$/.exec(dataUrl);
      if (match) {
        images.push({ mimeType: match[1], dataBase64: match[2] });
      }
    }
  }

  // Some APIs may return a top-level array of base64 strings
  if (images.length === 0 && Array.isArray(p)) {
    for (const item of p) {
      if (typeof item === "string") {
        if (item.startsWith("data:")) {
          const match = /^data:(.+?);base64,(.+)$/.exec(item);
          if (match) images.push({ mimeType: match[1], dataBase64: match[2] });
        } else {
          images.push({ mimeType: "image/png", dataBase64: item });
        }
      }
    }
  }

  return images;
}

async function callRapidApiGenerateImage(input: {
  prompt: string;
  model: string;
  n: number;
  size: string;
}): Promise<{ images: { mimeType: string; dataBase64: string }[]; raw: any }>{
  const key = process.env.RAPIDAPI_KEY;
  if (!key) {
    throw new Error("RAPIDAPI_KEY must be set");
  }

  // RapidAPI: use the OpenAI-style Images API if the hub supports it.
  // Host header is required by RapidAPI for this provider.
  const url = "https://xai-all-models.p.rapidapi.com/v1/images/generations";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-rapidapi-key": key,
      "x-rapidapi-host": "xai-all-models.p.rapidapi.com",
    },
    body: JSON.stringify({
      prompt: input.prompt,
      model: input.model,
      n: input.n,
      size: input.size,
      response_format: "b64_json",
    }),
  });

  const text = await res.text();
  let payload: any;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }

  if (!res.ok) {
    const msg =
      payload?.error?.message ??
      payload?.message ??
      `RapidAPI request failed (${res.status})`;
    const err = new Error(msg);
    (err as any).status = res.status;
    (err as any).payload = payload;
    throw err;
  }

  const images = extractBase64Images(payload);
  return { images, raw: payload };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get(api.images.list.path, async (_req, res) => {
    const items = await storage.listImageGenerations();
    res.json(items);
  });

  app.get(api.images.get.path, async (req, res) => {
    const item = await storage.getImageGeneration(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(item);
  });

  app.post(api.images.create.path, async (req, res) => {
    try {
      const input = api.images.create.input.parse(req.body);

      let images: { mimeType: string; dataBase64: string }[] = [];
      let error: string | null = null;

      try {
        const out = await callRapidApiGenerateImage({
          prompt: input.prompt,
          model: input.model,
          n: input.n,
          size: input.size,
        });
        images = out.images;
        if (images.length === 0) {
          error = "No images returned by provider.";
        }
      } catch (e: any) {
        error = e?.message ?? "Image generation failed";
      }

      const created = await storage.createImageGeneration({
        prompt: input.prompt,
        model: input.model,
        n: input.n,
        size: input.size,
        images,
        error,
      });

      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid input",
          field: err.errors[0]?.path?.join("."),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
