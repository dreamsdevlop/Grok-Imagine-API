import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
    const result = schema.safeParse(data);
    if (!result.success) {
        console.error(`[Zod] ${label} validation failed:`, result.error.format());
        throw result.error;
    }
    return result.data;
}

// Project Hooks
export function useProjects() {
    return useQuery({
        queryKey: [api.projects.list.path],
        queryFn: async () => {
            const res = await fetch(api.projects.list.path);
            if (!res.ok) throw new Error("Failed to fetch projects");
            const json = await res.json();
            return parseWithLogging(api.projects.list.responses[200], json, "projects.list");
        },
    });
}

export function useProject(id?: string) {
    return useQuery({
        queryKey: [api.projects.get.path, id ?? ""],
        enabled: !!id,
        queryFn: async () => {
            const url = buildUrl(api.projects.get.path, { id: id! });
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch project");
            const json = await res.json();
            return parseWithLogging(api.projects.get.responses[200], json, "projects.get");
        },
    });
}

export function useCreateProject() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (input: { name: string; description?: string }) => {
            const res = await fetch(api.projects.create.path, {
                method: api.projects.create.method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });
            if (!res.ok) throw new Error("Failed to create project");
            const json = await res.json();
            return parseWithLogging(api.projects.create.responses[201], json, "projects.create");
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [api.projects.list.path] });
        },
    });
}

// Model Hooks
export function useModels() {
    return useQuery({
        queryKey: [api.models.list.path],
        queryFn: async () => {
            const res = await fetch(api.models.list.path);
            if (!res.ok) throw new Error("Failed to fetch models");
            const json = await res.json();
            return parseWithLogging(api.models.list.responses[200], json, "models.list");
        },
        refetchInterval: 10000, // Refresh to see pull progress
    });
}

export function usePullModel() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (model: string) => {
            const res = await fetch(api.models.pull.path, {
                method: api.models.pull.method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ model }),
            });
            if (!res.ok) throw new Error("Failed to pull model");
            return await res.json();
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [api.models.list.path] });
        },
    });
}

// Status Hooks
export function useProviderStatus() {
    return useQuery({
        queryKey: [api.status.providers.path],
        queryFn: async () => {
            const res = await fetch(api.status.providers.path);
            if (!res.ok) throw new Error("Failed to fetch provider status");
            return await res.json();
        },
        refetchInterval: 30000,
    });
}
