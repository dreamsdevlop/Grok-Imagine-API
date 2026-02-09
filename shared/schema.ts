import { pgTable, text, varchar, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const imageGenerations = pgTable("image_generations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  prompt: text("prompt").notNull(),
  model: text("model").notNull(),
  n: text("n").notNull().default("1"),
  size: text("size").notNull(),
  images: jsonb("images").notNull().default([]), // Array of { mimeType, dataBase64 }
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull().default("New Conversation"),
  model: text("model").notNull().default("grok-2"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => chatSessions.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // "user" or "assistant"
  content: text("content").notNull(),
  model: text("model").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const videoGenerations = pgTable("video_generations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  prompt: text("prompt").notNull(),
  model: text("model").notNull(),
  duration: integer("duration").notNull().default(5), // in seconds
  width: integer("width").notNull().default(1024),
  height: integer("height").notNull().default(576),
  videoUrl: text("video_url"), // URL to the generated video
  thumbnailUrl: text("thumbnail_url"), // URL to video thumbnail
  status: text("status").notNull().default("pending"), // "pending", "processing", "completed", "failed"
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const assets = pgTable("assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // "image", "video", "audio"
  url: text("url").notNull(),
  metadata: jsonb("metadata").notNull().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const styles = pgTable("styles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  config: jsonb("config").notNull().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const characters = pgTable("characters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  faceUrl: text("face_url"),
  styleId: varchar("style_id").references(() => styles.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const apiKeys = pgTable("api_keys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  provider: text("provider").notNull(), // "openrouter", "replicate", etc.
  key: text("key").notNull(),
  isFreeKey: text("is_free_key").notNull().default("true"), // Store as text "true"/"false" for simplicity with Drizzle/PG
  createdAt: timestamp("created_at").defaultNow(),
});

export const usage = pgTable("usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  provider: text("provider").notNull(),
  count: integer("count").notNull().default(0),
  limit: integer("limit").notNull().default(50),
  isFreeModel: text("is_free_model").notNull().default("true"),
  resetAt: timestamp("reset_at"),
});

export const presets = pgTable("presets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  model: text("model").notNull(),
  params: jsonb("params").notNull().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const collections = pgTable("collections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  projectId: varchar("project_id").references(() => projects.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true });
export const insertAssetSchema = createInsertSchema(assets).omit({ id: true, createdAt: true });
export const insertStyleSchema = createInsertSchema(styles).omit({ id: true, createdAt: true });
export const insertCharacterSchema = createInsertSchema(characters).omit({ id: true, createdAt: true });
export const insertApiKeySchema = createInsertSchema(apiKeys).omit({ id: true, createdAt: true });
export const insertUsageSchema = createInsertSchema(usage).omit({ id: true });
export const insertPresetSchema = createInsertSchema(presets).omit({ id: true, createdAt: true });
export const insertCollectionSchema = createInsertSchema(collections).omit({ id: true, createdAt: true });

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Asset = typeof assets.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type Style = typeof styles.$inferSelect;
export type InsertStyle = z.infer<typeof insertStyleSchema>;
export type Character = typeof characters.$inferSelect;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type Usage = typeof usage.$inferSelect;
export type InsertUsage = z.infer<typeof insertUsageSchema>;
export type Preset = typeof presets.$inferSelect;
export type InsertPreset = z.infer<typeof insertPresetSchema>;
export type Collection = typeof collections.$inferSelect;
export type InsertCollection = z.infer<typeof insertCollectionSchema>;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertImageGenerationSchema = createInsertSchema(imageGenerations).omit({
  id: true,
  createdAt: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertVideoGenerationSchema = createInsertSchema(videoGenerations).omit({
  id: true,
  videoUrl: true,
  thumbnailUrl: true,
  status: true,
  error: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ImageGeneration = typeof imageGenerations.$inferSelect;
export type InsertImageGeneration = z.infer<typeof insertImageGenerationSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type VideoGeneration = typeof videoGenerations.$inferSelect;
export type InsertVideoGeneration = z.infer<typeof insertVideoGenerationSchema>;

export interface ImageGenerationResponse extends Omit<ImageGeneration, 'images'> {
  images: { mimeType: string; dataBase64: string }[];
}

export interface ChatSessionResponse extends ChatSession {
  messages: ChatMessage[];
}

export interface VideoGenerationResponse extends VideoGeneration {
  // Additional fields can be added here as needed
}

export type CreateImageRequest = {
  prompt: string;
  model: string;
  n: number;
  size: string;
};

export type CreateChatMessageRequest = {
  sessionId: string;
  content: string;
  model: string;
};

export type CreateVideoRequest = {
  prompt: string;
  model: string;
  duration: number;
  width: number;
  height: number;
};
