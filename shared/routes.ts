import { z } from "zod";
import { insertImageGenerationSchema } from "./schema";

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

const imageResultSchema = z.object({
  mimeType: z.string(),
  dataBase64: z.string(),
});

const imageGenerationResponseSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  model: z.string(),
  n: z.number(),
  size: z.string(),
  createdAt: z.string().or(z.date()),
  images: z.array(imageResultSchema),
  error: z.string().nullable().optional(),
});

export const api = {
  images: {
    list: {
      method: "GET" as const,
      path: "/api/images",
      responses: {
        200: z.array(imageGenerationResponseSchema),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/images",
      input: insertImageGenerationSchema.extend({
        prompt: z.string().min(3),
        model: z.string().min(1),
        n: z.coerce.number().int().min(1).max(4).default(1),
        size: z.enum(["512x512", "768x768", "1024x1024"]).default("1024x1024"),
      }),
      responses: {
        201: imageGenerationResponseSchema,
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/images/:id",
      responses: {
        200: imageGenerationResponseSchema,
        404: errorSchemas.notFound,
      },
    },
  },
} as const;

export function buildUrl(
  path: string,
  params?: Record<string, string | number>,
): string {
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

export type ImageGenerationResponse = z.infer<
  typeof api.images.create.responses[201]
>;
export type ImageGenerationListResponse = z.infer<
  typeof api.images.list.responses[200]
>;
export type CreateImageInput = z.infer<typeof api.images.create.input>;
export type ValidationError = z.infer<typeof errorSchemas.validation>;
export type NotFoundError = z.infer<typeof errorSchemas.notFound>;
export type InternalError = z.infer<typeof errorSchemas.internal>;
