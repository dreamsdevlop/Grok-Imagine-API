import { chatCompletion as openRouterChat } from "../integrations/openrouter-free";
import { ollamaChat, listLocalModels } from "../integrations/ollama-local";
import { googleChatCompletion } from "../integrations/google-ai-studio";
import { anthropicChatCompletion } from "../integrations/anthropic-claude";
import { cohereChatCompletion } from "../integrations/cohere.ts";
import { groqChatCompletion } from "../integrations/groq";
import { togetherChatCompletion } from "../integrations/together-ai";
import { getGpuStatus } from "./gpu-manager";
import { UsageTracker } from "./usage-tracker";

export type ProviderStatus = {
    gpu: {
        available: boolean;
        freeMemory: number;
        status: string;
    };
    ollama: { connected: boolean; modelCount: number; };
    openrouter: { connected: boolean; };
    google: { connected: boolean; };
    anthropic: { connected: boolean; };
    cohere: { connected: boolean; };
    groq: { connected: boolean; };
    together: { connected: boolean; };
};

export async function routeChat(messages: any[], preferredModel: string = "google/gemini-2.0-flash-exp:free") {
    try {
        console.log(`Routing request for model: ${preferredModel}`);

        // 1. Check for Local Models (Ollama)
        if (preferredModel.startsWith("ollama/") || preferredModel.includes(":")) {
            try {
                const localModels = await listLocalModels();
                const cleanName = preferredModel.replace("ollama/", "");
                if (localModels.some((m: any) => m.name === cleanName)) {
                    return await ollamaChat(messages, cleanName);
                }
            } catch (e) {
                console.warn("Local model routing failed, falling back to cloud.");
            }
        }

        // 2. Google Gemini Models
        if (preferredModel.startsWith("gemini-") || preferredModel.includes("google")) {
            const res = await googleChatCompletion(messages, preferredModel.split("/").pop() || preferredModel);
            await UsageTracker.track("google", preferredModel);
            return res;
        }

        // 3. Anthropic Claude Models
        if (preferredModel.startsWith("claude-") || preferredModel.includes("anthropic")) {
            const res = await anthropicChatCompletion(messages, preferredModel.split("/").pop() || preferredModel);
            await UsageTracker.track("anthropic", preferredModel);
            return res;
        }

        // 4. Groq Models
        if (preferredModel.includes("groq")) {
            const res = await groqChatCompletion(messages, preferredModel.split("/").pop() || preferredModel);
            await UsageTracker.track("groq", preferredModel);
            return res;
        }

        // 5. Cohere Models
        if (preferredModel.startsWith("command-") || preferredModel.includes("cohere")) {
            const res = await cohereChatCompletion(messages, preferredModel.split("/").pop() || preferredModel);
            await UsageTracker.track("cohere", preferredModel);
            return res;
        }

        // 6. Together AI
        if (preferredModel.includes("/")) {
            // Many together models have slash names
            try {
                const res = await togetherChatCompletion(messages, preferredModel);
                await UsageTracker.track("together", preferredModel);
                return res;
            } catch (e) {
                console.warn("Together AI failed, falling back to OpenRouter.");
            }
        }

        // 7. Default Fallback: OpenRouter
        const res = await openRouterChat(messages, preferredModel);
        await UsageTracker.track("openrouter", preferredModel);
        return res;
    } catch (error: any) {
        console.error("Routing Error:", error.message);
        throw error;
    }
}

export async function getProviderStatus(): Promise<ProviderStatus> {
    const gpu = await getGpuStatus();
    let ollamaModels = [];
    try { ollamaModels = await listLocalModels(); } catch (e) { }

    return {
        gpu: {
            available: gpu.available,
            freeMemory: gpu.freeMemory,
            status: gpu.status,
        },
        ollama: {
            connected: ollamaModels.length > 0,
            modelCount: ollamaModels.length,
        },
        openrouter: { connected: !!process.env.OPENROUTER_API_KEY },
        google: { connected: !!process.env.GOOGLE_AI_STUDIO_KEY },
        anthropic: { connected: !!process.env.ANTHROPIC_API_KEY },
        cohere: { connected: !!process.env.COHERE_API_KEY },
        groq: { connected: !!process.env.GROQ_API_KEY },
        together: { connected: !!process.env.TOGETHER_API_KEY },
    };
}
