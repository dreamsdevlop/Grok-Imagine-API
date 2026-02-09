import { createClient } from "@supabase/supabase-js";
import {
  users,
  imageGenerations,
  chatSessions,
  chatMessages,
  videoGenerations,
  projects,
  assets,
  usage as usageTable,
  apiKeys as apiKeysTable,
  type User,
  type InsertUser,
  type ImageGeneration,
  type ChatSession,
  type ChatMessage,
  type VideoGeneration,
  type Project,
  type InsertProject,
  type Asset,
  type InsertAsset,
  type Usage,
  type InsertUsage,
  type ApiKey,
  type InsertApiKey,
  type ImageGenerationResponse,
  type VideoGenerationResponse
} from "@shared/schema";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_ANON_KEY || ""
);


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

  listChatSessions(): Promise<ChatSession[]>;
  getChatSession(id: string): Promise<ChatSession | undefined>;
  createChatSession(data: {
    title: string;
    model: string;
  }): Promise<ChatSession>;
  updateChatSession(id: string, data: Partial<ChatSession>): Promise<ChatSession>;

  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(data: {
    sessionId: string;
    role: string;
    content: string;
    model: string;
  }): Promise<ChatMessage>;

  listVideoGenerations(): Promise<VideoGenerationResponse[]>;
  getVideoGeneration(id: string): Promise<VideoGenerationResponse | undefined>;
  createVideoGeneration(data: {
    prompt: string;
    model: string;
    duration: number;
    width: number;
    height: number;
    videoUrl: string;
    thumbnailUrl: string;
    status: string;
    error?: string | null;
  }): Promise<VideoGenerationResponse>;

  // Project management
  listProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(data: InsertProject): Promise<Project>;

  // Asset management
  listAssets(projectId?: string): Promise<Asset[]>;
  createAsset(data: InsertAsset): Promise<Asset>;

  // API usage tracking
  getUsage(provider: string): Promise<Usage | undefined>;
  updateUsage(provider: string, count: number): Promise<Usage>;

  // API Key management (optional, for secure key storage)
  getApiKey(provider: string): Promise<ApiKey | undefined>;
  saveApiKey(data: InsertApiKey): Promise<ApiKey>;
}

export class SupabaseStorage implements IStorage {
  async listImageGenerations(): Promise<ImageGenerationResponse[]> {
    const { data, error } = await supabase
      .from("image_generations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map((r: any) => ({
      ...r,
      createdAt: new Date(r.created_at),
      images: (r.images as unknown as { mimeType: string; dataBase64: string }[]) ?? [],
    }));
  }

  async getImageGeneration(id: string): Promise<ImageGenerationResponse | undefined> {
    const { data, error } = await supabase
      .from("image_generations")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    if (!data) return undefined;

    return {
      ...data,
      createdAt: new Date(data.created_at),
      images: (data.images as unknown as { mimeType: string; dataBase64: string }[]) ?? [],
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
    const { data: row, error } = await supabase
      .from("image_generations")
      .insert({
        prompt: data.prompt,
        model: data.model,
        n: String(data.n),
        size: data.size,
        images: data.images as any,
        error: data.error ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...row,
      createdAt: new Date(row.created_at),
      images: (row.images as unknown as { mimeType: string; dataBase64: string }[]) ?? [],
    };
  }

  async listChatSessions(): Promise<ChatSession[]> {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return (data || []).map((r: any) => ({
      ...r,
      createdAt: new Date(r.created_at),
      updatedAt: new Date(r.updated_at),
    }));
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    if (!data) return undefined;

    return {
      ...data,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async createChatSession(data: {
    title: string;
    model: string;
  }): Promise<ChatSession> {
    const { data: row, error } = await supabase
      .from("chat_sessions")
      .insert({
        title: data.title,
        model: data.model,
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...row,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async updateChatSession(id: string, data: Partial<ChatSession>): Promise<ChatSession> {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.model !== undefined) updateData.model = data.model;
    if (data.updatedAt !== undefined) updateData.updated_at = data.updatedAt;

    const { data: row, error } = await supabase
      .from("chat_sessions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...row,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data || []).map((r: any) => ({
      ...r,
      sessionId: r.session_id,
      createdAt: new Date(r.created_at),
    }));
  }

  async createChatMessage(data: {
    sessionId: string;
    role: string;
    content: string;
    model: string;
  }): Promise<ChatMessage> {
    const { data: row, error } = await supabase
      .from("chat_messages")
      .insert({
        session_id: data.sessionId,
        role: data.role,
        content: data.content,
        model: data.model,
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...row,
      sessionId: row.session_id,
      createdAt: new Date(row.created_at),
    };
  }

  async listVideoGenerations(): Promise<VideoGenerationResponse[]> {
    const { data, error } = await supabase
      .from("video_generations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map((r: any) => ({
      ...r,
      createdAt: new Date(r.created_at),
      videoUrl: r.video_url,
      thumbnailUrl: r.thumbnail_url,
    }));
  }

  async getVideoGeneration(id: string): Promise<VideoGenerationResponse | undefined> {
    const { data, error } = await supabase
      .from("video_generations")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    if (!data) return undefined;

    return {
      ...data,
      createdAt: new Date(data.created_at),
      videoUrl: data.video_url,
      thumbnailUrl: data.thumbnail_url,
    };
  }

  async createVideoGeneration(data: {
    prompt: string;
    model: string;
    duration: number;
    width: number;
    height: number;
    videoUrl: string;
    thumbnailUrl: string;
    status: string;
    error?: string | null;
  }): Promise<VideoGenerationResponse> {
    const { data: row, error } = await supabase
      .from("video_generations")
      .insert({
        prompt: data.prompt,
        model: data.model,
        duration: data.duration,
        width: data.width,
        height: data.height,
        video_url: data.videoUrl,
        thumbnail_url: data.thumbnailUrl,
        status: data.status,
        error: data.error ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...row,
      createdAt: new Date(row.created_at),
      videoUrl: row.video_url,
      thumbnailUrl: row.thumbnail_url,
    };
  }

  // New methods
  async listProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(p => ({ ...p, createdAt: new Date(p.created_at) }));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    if (!data) return undefined;
    return { ...data, createdAt: new Date(data.created_at) };
  }

  async createProject(data: InsertProject): Promise<Project> {
    const { data: row, error } = await supabase
      .from("projects")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return { ...row, createdAt: new Date(row.created_at) };
  }

  async listAssets(projectId?: string): Promise<Asset[]> {
    let query = supabase.from("assets").select("*").order("created_at", { ascending: false });
    if (projectId) query = query.eq("project_id", projectId);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(a => ({ ...a, createdAt: new Date(a.created_at), projectId: a.project_id }));
  }

  async createAsset(data: InsertAsset): Promise<Asset> {
    const { data: row, error } = await supabase
      .from("assets")
      .insert({
        project_id: data.projectId,
        type: data.type,
        url: data.url,
        metadata: data.metadata,
      })
      .select()
      .single();
    if (error) throw error;
    return { ...row, createdAt: new Date(row.created_at), projectId: row.project_id };
  }

  async getUsage(provider: string): Promise<Usage | undefined> {
    const { data, error } = await supabase
      .from("usage")
      .select("*")
      .eq("provider", provider)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    if (!data) return undefined;
    return {
      ...data,
      isFreeModel: data.is_free_model || "true",
      resetAt: data.reset_at ? new Date(data.reset_at) : null
    };
  }

  async updateUsage(provider: string, count: number): Promise<Usage> {
    const { data: row, error } = await supabase
      .from("usage")
      .upsert({ provider, count })
      .select()
      .single();
    if (error) throw error;
    return {
      ...row,
      isFreeModel: row.is_free_model || "true",
      resetAt: row.reset_at ? new Date(row.reset_at) : null
    };
  }

  async getApiKey(provider: string): Promise<ApiKey | undefined> {
    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("provider", provider)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    if (!data) return undefined;
    return {
      ...data,
      isFreeKey: data.is_free_key || "true",
      createdAt: new Date(data.created_at)
    };
  }

  async saveApiKey(data: InsertApiKey): Promise<ApiKey> {
    const { data: row, error } = await supabase
      .from("api_keys")
      .upsert({ provider: data.provider, key: data.key, is_free_key: data.isFreeKey || "true" })
      .select()
      .single();
    if (error) throw error;
    return {
      ...row,
      isFreeKey: row.is_free_key || "true",
      createdAt: new Date(row.created_at)
    };
  }
}

// Force database usage as requested
export const storage = new SupabaseStorage();

