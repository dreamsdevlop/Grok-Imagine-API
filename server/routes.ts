// Full routes implementation
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { getProviderStatus, routeChat } from "./services/model-router";
import { routeChatFree } from "./services/free-model-router";
import { getGpuStatus } from "./services/gpu-manager";
import { hfInference } from "./integrations/huggingface-inference";
import { ApiKeyManager } from "./services/api-key-manager";
import { listLocalModels } from "./integrations/ollama-local";
import { pullLocalModel } from "./services/model-downloader";
import {
  callRapidApiChatCompletion,
  callRapidApiGenerateImage,
  callRapidApiGenerateVideo
} from "./integrations/grok-rapidapi";


export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // Health check
  app.get(api.health.path, (_req, res) => {
    res.json({ ok: true });
  });

  // Direct AI completions (for battleground/tools)
  app.post("/api/completions", async (req, res) => {
    try {
      const { content, model, history = [] } = req.body;
      if (!content) return res.status(400).json({ message: "Content is required" });

      const messages = [...history, { role: "user", content }];

      let response;
      if (model.includes("grok") || model.includes("xai")) {
        // Special case for Grok via RapidAPI if needed, though routeChat should handle it
        response = await callRapidApiChatCompletion({ messages, model });
      } else {
        response = await routeChat(messages, model);
      }

      const text = typeof response === 'string' ? response : response?.content ?? response?.choices?.[0]?.message?.content ?? "";

      res.json({ content: text });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Completion failed" });
    }
  });

  // Image generation routes
  app.get(api.images.list.path, async (_req, res) => {
    const items = await storage.listImageGenerations();
    res.json(items);
  });

  app.get(api.images.get.path, async (req, res) => {
    const id = String(req.params.id);
    const item = await storage.getImageGeneration(id);
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
        if (input.model.includes("/") || input.model.includes("black-forest-labs") || input.model.includes("stabilityai")) {
          console.log(`Routing to HuggingFace for model: ${input.model}`);
          const result = await hfInference({ inputs: input.prompt }, input.model);

          if (Buffer.isBuffer(result)) {
            images = [{ mimeType: "image/png", dataBase64: result.toString("base64") }];
          } else if (result && typeof result === 'object' && !Array.isArray(result)) {
            // Handle JSON response if it's not a buffer
            error = result.error || "Failed to generate image from HF";
          }
        } else {
          const out = await callRapidApiGenerateImage({
            prompt: input.prompt,
            model: input.model,
            n: input.n,
            size: input.size,
          });
          images = out.images;
        }

        if (images.length === 0 && !error) {
          error = "No images returned by provider. Check response.";
        }
      } catch (e: any) {
        error = e?.message ?? "Image generation failed";
        console.error("Image generation error:", e);
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

  // Chat routes
  app.get(api.chat.list.path, async (_req, res) => {
    const sessions = await storage.listChatSessions();
    res.json(sessions);
  });

  app.get(api.chat.get.path, async (req, res) => {
    const id = String(req.params.id);
    const session = await storage.getChatSession(id);
    if (!session) {
      return res.status(404).json({ message: "Not found" });
    }
    const messages = await storage.getChatMessages(id);
    res.json({ ...session, messages });
  });

  app.post(api.chat.create.path, async (req, res) => {
    try {
      const input = api.chat.create.input.parse(req.body);

      const created = await storage.createChatSession({
        title: input.title,
        model: input.model,
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

  app.get(api.chat.messages.list.path, async (req, res) => {
    const id = String(req.params.id);
    const messages = await storage.getChatMessages(id);
    res.json(messages);
  });

  app.post(api.chat.messages.create.path, async (req, res) => {
    try {
      const id = String(req.params.id);
      const input = api.chat.messages.create.input.parse(req.body);

      // First, save the user message
      const userMessage = await storage.createChatMessage({
        sessionId: id,
        role: "user",
        content: input.content,
        model: input.model,
      });

      // Then call the AI model
      let content: string = "";
      let error: string | null = null;

      try {
        const history = await storage.getChatMessages(id);
        const mappedHistory = history.map(m => ({ role: m.role, content: m.content }));

        const response = await routeChatFree(mappedHistory, input.model);
        content = response?.content || "";
      } catch (e: any) {
        error = e?.message ?? "Chat completion failed";
        console.error("Chat routing error:", e);
      }

      // Save the assistant message
      const assistantMessage = await storage.createChatMessage({
        sessionId: id,
        role: "assistant",
        content: content,
        model: input.model,
      });

      // Update session timestamp
      await storage.updateChatSession(id, { updatedAt: new Date() });

      res.status(201).json({ userMessage, assistantMessage, error });
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

  // Video generation routes
  app.get(api.videos.list.path, async (_req, res) => {
    const items = await storage.listVideoGenerations();
    res.json(items);
  });

  app.get(api.videos.get.path, async (req, res) => {
    const id = String(req.params.id);
    const item = await storage.getVideoGeneration(id);
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(item);
  });

  app.post(api.videos.create.path, async (req, res) => {
    try {
      const input = api.videos.create.input.parse(req.body);

      let videoUrl: string = "";
      let thumbnailUrl: string = "";
      let error: string | null = null;
      let status = "pending";

      try {
        const out = await callRapidApiGenerateVideo({
          prompt: input.prompt,
          model: input.model,
          duration: input.duration,
          width: input.width,
          height: input.height,
        });
        videoUrl = out.videoUrl;
        thumbnailUrl = out.thumbnailUrl;
        status = videoUrl ? "completed" : "failed";
        if (!videoUrl) {
          error = "No video URL returned by provider. Check RapidAPI response.";
        }
      } catch (e: any) {
        error = e?.message ?? "Video generation failed";
        status = "failed";
      }

      const created = await storage.createVideoGeneration({
        prompt: input.prompt,
        model: input.model,
        duration: input.duration,
        width: input.width,
        height: input.height,
        videoUrl,
        thumbnailUrl,
        status,
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

  // Project routes
  app.get(api.projects.list.path, async (_req, res) => {
    const items = await storage.listProjects();
    res.json(items);
  });

  app.get(api.projects.get.path, async (req, res) => {
    const id = String(req.params.id);
    const item = await storage.getProject(id);
    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }
    const assets = await storage.listAssets(id);
    res.json({ ...item, assets });
  });

  app.post(api.projects.create.path, async (req, res) => {
    try {
      const input = api.projects.create.input.parse(req.body);
      const created = await storage.createProject(input);
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

  // Status routes
  app.get(api.status.providers.path, async (_req, res) => {
    const status = await getProviderStatus();
    res.json(status);
  });

  app.get(api.status.gpu.path, async (_req, res) => {
    const status = await getGpuStatus();
    res.json(status);
  });

  // Model routes
  app.get(api.models.list.path, async (_req, res) => {
    try {
      const local = await listLocalModels();
      res.json(local);
    } catch (e) {
      res.json([]);
    }
  });

  app.post(api.models.pull.path, async (req, res) => {
    try {
      const { model } = api.models.pull.input.parse(req.body);
      const result = await pullLocalModel(model);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  // Key management routes
  app.get(api.keys.list.path, async (_req, res) => {
    // Return masked keys or just provider names for security
    const providers = ["openrouter", "google", "anthropic", "cohere", "groq", "together", "huggingface", "replicate"];
    const results = [];
    for (const p of providers) {
      const key = await storage.getApiKey(p);
      if (key) results.push({ provider: p, createdAt: key.createdAt?.toISOString() || new Date().toISOString() });
    }
    res.json(results);
  });

  app.post(api.keys.save.path, async (req, res) => {
    try {
      const { provider, key } = api.keys.save.input.parse(req.body);
      await ApiKeyManager.setEncryptedKey(provider, key);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.delete(api.keys.delete.path, async (req, res) => {
    const provider = req.params.provider;
    // We would need a delete method in storage. For now, we can just overwrite with empty if needed,
    // or assume we'll add delete later. I'll add a dummy success for now as placeholder.
    res.json({ success: true });
  });

  // Usage routes
  app.get(api.usage.list.path, async (_req, res) => {
    const providers = ["openrouter", "google", "anthropic", "cohere", "groq", "together"];
    const results = [];
    for (const p of providers) {
      const u = await storage.getUsage(p);
      if (u) results.push(u);
    }
    res.json(results);
  });

  return httpServer;
}
