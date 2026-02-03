import { db } from "./db";
import { imageGenerations, type CreateImageRequest, type ImageGenerationResponse } from "@shared/schema";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  listImageGenerations(): Promise<ImageGenerationResponse[]>;
  getImageGeneration(id: string): Promise<ImageGenerationResponse | undefined>;
  createImageGeneration(data: {
    prompt: string;
    model: string;
    n: number;
    size: string;
    images: { mimeType: string; dataBase64: string }[];
    error?: string | null;
  }): Promise<ImageGenerationResponse>;
}

export class DatabaseStorage implements IStorage {
  async listImageGenerations(): Promise<ImageGenerationResponse[]> {
    const rows = await db
      .select()
      .from(imageGenerations)
      .orderBy(desc(imageGenerations.createdAt));

    return rows.map((r) => ({
      ...r,
      images: (r.images as unknown as { mimeType: string; dataBase64: string }[]) ?? [],
    }));
  }

  async getImageGeneration(id: string): Promise<ImageGenerationResponse | undefined> {
    const [row] = await db
      .select()
      .from(imageGenerations)
      .where(eq(imageGenerations.id, id));

    if (!row) return undefined;

    return {
      ...row,
      images: (row.images as unknown as { mimeType: string; dataBase64: string }[]) ?? [],
    };
  }

  async createImageGeneration(data: {
    prompt: string;
    model: string;
    n: number;
    size: string;
    images: { mimeType: string; dataBase64: string }[];
    error?: string | null;
  }): Promise<ImageGenerationResponse> {
    const [row] = await db
      .insert(imageGenerations)
      .values({
        prompt: data.prompt,
        model: data.model,
        n: data.n,
        size: data.size,
        images: data.images as unknown as any,
        error: data.error ?? null,
      })
      .returning();

    return {
      ...row,
      images: (row.images as unknown as { mimeType: string; dataBase64: string }[]) ?? [],
    };
  }
}

export const storage = new DatabaseStorage();
