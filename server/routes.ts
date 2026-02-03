import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

function extractBase64Images(payload: any): { mimeType: string; dataBase64: string }[] {
  const images: { mimeType: string; dataBase64: string }[] = [];
  
  // Try to find images in the payload based on common RapidAPI patterns
  if (payload && typeof payload === 'object') {
    // OpenAI-style response: { data: [{ b64_json: '...' }] }
    if (Array.isArray(payload.data)) {
      payload.data.forEach((item: any) => {
        if (item.b64_json) {
          images.push({ mimeType: "image/png", dataBase64: item.b64_json });
        } else if (item.url && item.url.startsWith('data:')) {
           const match = item.url.match(/^data:([^;]+);base64,(.+)$/);
           if (match) {
             images.push({ mimeType: match[1], dataBase64: match[2] });
           }
        }
      });
    }
    // Simple array response
    else if (Array.isArray(payload)) {
        payload.forEach((item: any) => {
            if (typeof item === 'string' && item.length > 100) {
                 images.push({ mimeType: "image/png", dataBase64: item });
            }
        });
    }
  }
  
  return images;
}

async function callRapidApiGenerateImage(input: {
  prompt: string;
  model: string;
  n: number;
  size: string;
}): Promise<{ images: { mimeType: string; dataBase64: string }[]; raw: any }> {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) {
    throw new Error("RAPIDAPI_KEY must be set");
  }

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
    const msg = payload?.error?.message ?? payload?.message ?? `RapidAPI request failed (${res.status})`;
    throw new Error(msg);
  }

  const images = extractBase64Images(payload);
  return { images, raw: payload };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.get(api.health.path, (_req, res) => {
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
          error = "No images returned by provider. Check RapidAPI response.";
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
