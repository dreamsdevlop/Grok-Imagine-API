import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  api,
  buildUrl,
  type CreateImageInput,
  type ImageGenerationListResponse,
  type ImageGenerationResponse,
  type CreateChatMessageInput,
  type ChatSessionListResponse,
  type ChatSessionResponse,
  type CreateVideoInput,
  type VideoGenerationListResponse,
  type VideoGenerationResponse,
} from "@shared/routes";
import { z } from "zod";
import { useToast as useToastHook } from "@/components/ui/use-toast";

// Re-export useToast for convenience
export { useToastHook as useToast };

// Type for chat messages
export type ChatMessage = {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  model: string;
  createdAt: Date;
};

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

// Image generation hooks
export function useImageGenerations() {
  return useQuery({
    queryKey: [api.images.list.path],
    queryFn: async (): Promise<ImageGenerationListResponse> => {
      const res = await fetch(api.images.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch image generations");
      const json = await res.json();
      return parseWithLogging(api.images.list.responses[200], json, "images.list");
    },
  });
}

export function useImageGeneration(id?: string) {
  return useQuery({
    queryKey: [api.images.get.path, id ?? ""],
    enabled: !!id,
    queryFn: async (): Promise<ImageGenerationResponse | null> => {
      const url = buildUrl(api.images.get.path, { id: id! });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch image generation");
      const json = await res.json();
      return parseWithLogging(api.images.get.responses[200], json, "images.get");
    },
  });
}

export function useCreateImageGeneration() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateImageInput): Promise<ImageGenerationResponse> => {
      const validated = api.images.create.input.parse(input);

      const res = await fetch(api.images.create.path, {
        method: api.images.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(
            api.images.create.responses[400],
            await res.json(),
            "images.create.400",
          );
          throw new Error(err.message);
        }
        if (res.status === 500) {
          const err = parseWithLogging(
            api.images.create.responses[500],
            await res.json(),
            "images.create.500",
          );
          throw new Error(err.message);
        }
        throw new Error("Failed to generate image");
      }

      const json = await res.json();
      const created = parseWithLogging(api.images.create.responses[201], json, "images.create.201");
      return created;
    },
    onSuccess: async (created) => {
      // Refresh history list
      await qc.invalidateQueries({ queryKey: [api.images.list.path] });
      // Prime detail cache
      qc.setQueryData([api.images.get.path, created.id], created);
    },
  });
}

// Chat hooks
export function useChatSessions() {
  return useQuery({
    queryKey: [api.chat.list.path],
    queryFn: async (): Promise<ChatSessionListResponse> => {
      const res = await fetch(api.chat.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch chat sessions");
      const json = await res.json();
      return parseWithLogging(api.chat.list.responses[200], json, "chat.list");
    },
  });
}

export function useChatSession(id?: string) {
  return useQuery({
    queryKey: [api.chat.get.path, id ?? ""],
    enabled: !!id,
    queryFn: async (): Promise<ChatSessionResponse | null> => {
      const url = buildUrl(api.chat.get.path, { id: id! });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch chat session");
      const json = await res.json();
      return parseWithLogging(api.chat.get.responses[200], json, "chat.get");
    },
  });
}

export function useCreateChatSession() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: { title: string; model: string }): Promise<ChatSessionResponse> => {
      const validated = api.chat.create.input.parse(input);

      const res = await fetch(api.chat.create.path, {
        method: api.chat.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(
            api.chat.create.responses[400],
            await res.json(),
            "chat.create.400",
          );
          throw new Error(err.message);
        }
        if (res.status === 500) {
          const err = parseWithLogging(
            api.chat.create.responses[500],
            await res.json(),
            "chat.create.500",
          );
          throw new Error(err.message);
        }
        throw new Error("Failed to create chat session");
      }

      const json = await res.json();
      const created = parseWithLogging(api.chat.create.responses[201], json, "chat.create.201");
      return created;
    },
    onSuccess: async (created) => {
      // Refresh sessions list
      await qc.invalidateQueries({ queryKey: [api.chat.list.path] });
      // Prime detail cache
      qc.setQueryData([api.chat.get.path, created.id], created);
    },
  });
}

export function useChatMessages(sessionId?: string) {
  return useQuery({
    queryKey: [api.chat.messages.list.path, sessionId ?? ""],
    enabled: !!sessionId,
    queryFn: async (): Promise<ChatMessage[]> => {
      const url = buildUrl(api.chat.messages.list.path, { id: sessionId! });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch chat messages");
      const json = await res.json();
      return parseWithLogging(api.chat.messages.list.responses[200], json, "chat.messages.list");
    },
  });
}

export function useSendMessage() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: { sessionId: string; content: string; model: string }): Promise<{
      userMessage: any;
      assistantMessage: any;
      error?: string | null;
    }> => {
      const validated = api.chat.messages.create.input.parse(input);

      const url = buildUrl(api.chat.messages.create.path, { id: input.sessionId });
      const res = await fetch(url, {
        method: api.chat.messages.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(
            api.chat.messages.create.responses[400],
            await res.json(),
            "chat.messages.create.400",
          );
          throw new Error(err.message);
        }
        if (res.status === 404) {
          const err = parseWithLogging(
            api.chat.messages.create.responses[404],
            await res.json(),
            "chat.messages.create.404",
          );
          throw new Error(err.message);
        }
        if (res.status === 500) {
          const err = parseWithLogging(
            api.chat.messages.create.responses[500],
            await res.json(),
            "chat.messages.create.500",
          );
          throw new Error(err.message);
        }
        throw new Error("Failed to send message");
      }

      const json = await res.json();
      return json;
    },
    onSuccess: async (result, variables) => {
      // Refresh messages list
      await qc.invalidateQueries({ queryKey: [api.chat.messages.list.path, variables.sessionId] });
      // Refresh session to update timestamp
      await qc.invalidateQueries({ queryKey: [api.chat.get.path, variables.sessionId] });
    },
  });
}

// Video generation hooks
export function useVideoGenerations() {
  return useQuery({
    queryKey: [api.videos.list.path],
    queryFn: async (): Promise<VideoGenerationListResponse> => {
      const res = await fetch(api.videos.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch video generations");
      const json = await res.json();
      return parseWithLogging(api.videos.list.responses[200], json, "videos.list");
    },
  });
}

export function useVideoGeneration(id?: string) {
  return useQuery({
    queryKey: [api.videos.get.path, id ?? ""],
    enabled: !!id,
    queryFn: async (): Promise<VideoGenerationResponse | null> => {
      const url = buildUrl(api.videos.get.path, { id: id! });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch video generation");
      const json = await res.json();
      return parseWithLogging(api.videos.get.responses[200], json, "videos.get");
    },
  });
}

export function useCreateVideoGeneration() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateVideoInput): Promise<VideoGenerationResponse> => {
      const validated = api.videos.create.input.parse(input);

      const res = await fetch(api.videos.create.path, {
        method: api.videos.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const err = parseWithLogging(
            api.videos.create.responses[400],
            await res.json(),
            "videos.create.400",
          );
          throw new Error(err.message);
        }
        if (res.status === 500) {
          const err = parseWithLogging(
            api.videos.create.responses[500],
            await res.json(),
            "videos.create.500",
          );
          throw new Error(err.message);
        }
        throw new Error("Failed to generate video");
      }

      const json = await res.json();
      const created = parseWithLogging(api.videos.create.responses[201], json, "videos.create.201");
      return created;
    },
    onSuccess: async (created) => {
      // Refresh history list
      await qc.invalidateQueries({ queryKey: [api.videos.list.path] });
      // Prime detail cache
      qc.setQueryData([api.videos.get.path, created.id], created);
    },
  });
}
