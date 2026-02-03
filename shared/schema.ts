import { sql } from "drizzle-orm";
import { integer, jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const imageGenerations = pgTable("image_generations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  prompt: text("prompt").notNull(),
  model: text("model").notNull(),
  n: integer("n").notNull().default(1),
  size: text("size").notNull().default("1024x1024"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  images: jsonb("images").notNull().default(sql`'[]'::jsonb`),
  error: text("error"),
});

export const insertImageGenerationSchema = createInsertSchema(imageGenerations).omit({
  id: true,
  createdAt: true,
  images: true,
  error: true,
});

export type ImageGeneration = typeof imageGenerations.$inferSelect;
export type InsertImageGeneration = z.infer<typeof insertImageGenerationSchema>;

export type CreateImageRequest = InsertImageGeneration;
export type ImageResult = { mimeType: string; dataBase64: string };
export type ImageGenerationResponse = Omit<ImageGeneration, "images"> & {
  images: ImageResult[];
};
