import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertImageGenerationSchema = createInsertSchema(imageGenerations).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ImageGeneration = typeof imageGenerations.$inferSelect;
export type InsertImageGeneration = z.infer<typeof insertImageGenerationSchema>;

export interface ImageGenerationResponse extends Omit<ImageGeneration, 'images'> {
  images: { mimeType: string; dataBase64: string }[];
}

export type CreateImageRequest = {
  prompt: string;
  model: string;
  n: number;
  size: string;
};
