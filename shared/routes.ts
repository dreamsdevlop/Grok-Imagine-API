import { z } from "zod";
import { imageGenerations, chatSessions, chatMessages, videoGenerations } from "./schema";

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
        500: errorSchemas.internal,
      },
    },
  },
  chat: {
    list: {
      method: "GET" as const,
      path: "/api/chat",
      responses: {
        200: z.array(z.custom<any>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/chat/:id",
      responses: {
        200: z.custom<any>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/chat",
      input: z.object({
        title: z.string().default("New Conversation"),
        model: z.string().default("grok-2"),
      }),
      responses: {
        201: z.custom<any>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    messages: {
      list: {
        method: "GET" as const,
        path: "/api/chat/:id/messages",
        responses: {
          200: z.array(z.custom<any>()),
          404: errorSchemas.notFound,
        },
      },
      create: {
        method: "POST" as const,
        path: "/api/chat/:id/messages",
        input: z.object({
          content: z.string().min(1),
          model: z.string().default("grok-2"),
        }),
        responses: {
          201: z.custom<any>(),
          400: errorSchemas.validation,
          404: errorSchemas.notFound,
          500: errorSchemas.internal,
        },
      },
    },
  },
  videos: {
    list: {
      method: "GET" as const,
      path: "/api/videos",
      responses: {
        200: z.array(z.custom<any>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/videos/:id",
      responses: {
        200: z.custom<any>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/videos",
      input: z.object({
        prompt: z.string().min(1),
        model: z.string().default("grok-video"),
        duration: z.number().int().min(1).max(30).default(5),
        width: z.number().int().min(256).max(1920).default(1024),
        height: z.number().int().min(256).max(1080).default(576),
      }),
      responses: {
        201: z.custom<any>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
  projects: {
    list: {
      method: "GET" as const,
      path: "/api/projects",
      responses: {
        200: z.array(z.custom<any>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/projects/:id",
      responses: {
        200: z.custom<any>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/projects",
      input: z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      }),
      responses: {
        201: z.custom<any>(),
        400: errorSchemas.validation,
      },
    },
  },
  status: {
    providers: {
      method: "GET" as const,
      path: "/api/status/providers",
      responses: {
        200: z.custom<any>(),
      },
    },
    gpu: {
      method: "GET" as const,
      path: "/api/status/gpu",
      responses: {
        200: z.custom<any>(),
      },
    },
  },
  models: {
    list: {
      method: "GET" as const,
      path: "/api/models",
      responses: {
        200: z.array(z.custom<any>()),
      },
    },
    pull: {
      method: "POST" as const,
      path: "/api/models/pull",
      input: z.object({
        model: z.string(),
      }),
      responses: {
        200: z.custom<any>(),
      },
    },
  },
  keys: {
    list: {
      method: "GET" as const,
      path: "/api/keys",
      responses: {
        200: z.array(z.object({ provider: z.string(), createdAt: z.string() })),
      },
    },
    save: {
      method: "POST" as const,
      path: "/api/keys",
      input: z.object({
        provider: z.string(),
        key: z.string().min(1),
      }),
      responses: {
        200: z.custom<any>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/keys/:provider",
      responses: {
        200: z.object({ success: z.boolean() }),
      },
    },
  },
  usage: {
    list: {
      method: "GET" as const,
      path: "/api/usage",
      responses: {
        200: z.array(z.custom<any>()),
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

// Export types for frontend use
export type CreateImageInput = z.infer<typeof api.images.create.input>;
export type ImageGenerationListResponse = z.infer<typeof api.images.list.responses[200]>;
export type ImageGenerationResponse = z.infer<typeof api.images.get.responses[200]>;

export type CreateChatSessionInput = z.infer<typeof api.chat.create.input>;
export type ChatSessionListResponse = z.infer<typeof api.chat.list.responses[200]>;
export type ChatSessionResponse = z.infer<typeof api.chat.get.responses[200]>;

export type CreateChatMessageInput = z.infer<typeof api.chat.messages.create.input>;
export type ChatMessageListResponse = z.infer<typeof api.chat.messages.list.responses[200]>;

export type CreateVideoInput = z.infer<typeof api.videos.create.input>;
export type VideoGenerationListResponse = z.infer<typeof api.videos.list.responses[200]>;
export type VideoGenerationResponse = z.infer<typeof api.videos.get.responses[200]>;
