import { chatCompletion as googleChat } from "../integrations/google-gemini-free";
import { chatCompletion as groqChat } from "../integrations/groq-free";
import { chatCompletion as togetherChat } from "../integrations/together-ai-free";
import { chatCompletion as openRouterChat } from "../integrations/openrouter-free";
import { callRapidApiChatCompletion as grokChat } from "../integrations/grok-rapidapi";
import { ollamaChat } from "../integrations/ollama-local";
import { FreeQuotaManager } from "./free-quota-manager";

/**
 * Free Model Router
 * Prioritizes free models and handles fallbacks
 */

export async function routeChatFree(messages: any[], preferredModel?: string) {
    // If a preferred model is provided, try that first if it's free
    // Fallback chain: Google Gemini -> Groq -> Grok -> Together -> OpenRouter -> Ollama

    const fallbackChain = [
        { name: "google", chat: (msgs: any[], model: string) => googleChat({ messages: msgs, model }), model: "google/gemini-1.5-flash:free" },
        { name: "groq", chat: (msgs: any[], model: string) => groqChat({ messages: msgs, model }), model: "groq/llama-3.1-70b-versatile" },
        { name: "grok", chat: (msgs: any[], model: string) => grokChat({ messages: msgs, model }), model: "grok-2-mini" },
        { name: "together", chat: (msgs: any[], model: string) => togetherChat({ messages: msgs, model }), model: "together/meta-llama/Llama-3.1-8B-Instruct-Turbo" },
        { name: "openrouter", chat: (msgs: any[], model: string) => openRouterChat(msgs, model), model: "google/gemini-2.0-flash-exp:free" },
    ];

    // If preferred model is in the chain or explicitly requested
    if (preferredModel) {
        const provider = preferredModel.split("/")[0];
        if (await FreeQuotaManager.canUseProvider(provider)) {
            try {
                console.log(`Using preferred free model: ${preferredModel}`);
                const res = await callProvider(provider, messages, preferredModel);
                await FreeQuotaManager.incrementUsage(provider);
                return res;
            } catch (e) {
                console.warn(`Preferred model ${preferredModel} failed, falling back...`);
            }
        }
    }

    // Iterate through fallback chain
    for (const provider of fallbackChain) {
        if (await FreeQuotaManager.canUseProvider(provider.name)) {
            try {
                console.log(`Routing to fallback free provider: ${provider.name} (${provider.model})`);
                const res = await provider.chat(messages, provider.model);
                await FreeQuotaManager.incrementUsage(provider.name);
                return res;
            } catch (e) {
                console.warn(`${provider.name} failed:`, e);
                continue;
            }
        }
    }

    // Ultimate fallback: Local Ollama
    try {
        console.log("All cloud providers exhausted, falling back to Ollama");
        return await ollamaChat(messages, "mistral");
    } catch (e) {
        throw new Error("All AI providers (including local fallback) failed or quota exceeded.");
    }
}

async function callProvider(provider: string, messages: any[], model: string) {
    switch (provider) {
        case "google": return await googleChat({ messages, model });
        case "groq": return await groqChat({ messages, model });
        case "together": return await togetherChat({ messages, model });
        case "openrouter": return await openRouterChat(messages, model);
        case "grok": return await grokChat({ messages, model });
        default: throw new Error(`Unknown provider: ${provider}`);
    }
}
