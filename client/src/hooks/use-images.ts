import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  api,
  buildUrl,
  type CreateImageInput,
  type ImageGenerationListResponse,
  type ImageGenerationResponse,
} from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

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
