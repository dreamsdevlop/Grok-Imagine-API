import { z } from "zod";
import { imageGenerations } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  health: {
    method: "GET" as const,
    path: "/api/health",
    responses: {
      200: z.object({ ok: z.boolean() }),
    },
  },
  images: {
    list: {
      method: "GET" as const,
      path: "/api/images",
      responses: {
        200: z.array(z.custom<any>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/images/:id",
      responses: {
        200: z.custom<any>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/images",
      input: z.object({
        prompt: z.string().min(1),
        model: z.string().default("grok-2-image"),
        n: z.number().int().min(1).max(4).default(1),
        size: z.string().default("1024x1024"),
      }),
      responses: {
        201: z.custom<any>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
