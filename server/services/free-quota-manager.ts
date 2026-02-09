import { storage } from "../storage";

/**
 * Free Tier Quota Manager
 * Tracks daily/monthly usage for free providers
 */

export interface Quota {
    limit: number;
    used: number;
    resetAt: Date;
}

const PROVIDER_LIMITS: Record<string, number> = {
    google: 1000, // Gemini 1.5 Flash free tier ~1000/day
    groq: 30,     // Groq free tier ~30/min (we'll track per day for simplicity in local state or usage table)
    together: 100, // Arbitrary for free tier
    openrouter: 100,
    grok: 50,     // RapidAPI free tier depends on specific key
};

export class FreeQuotaManager {
    static async getQuota(provider: string): Promise<Quota> {
        const usage = await storage.getUsage(provider);
        const limit = PROVIDER_LIMITS[provider] || 100;

        // Logic for reset (daily at UTC midnight)
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (usage && usage.resetAt && new Date(usage.resetAt) < today) {
            // Reset usage if the last reset was before today
            await storage.updateUsage(provider, 0);
            return { limit, used: 0, resetAt: today };
        }

        return {
            limit,
            used: usage?.count || 0,
            resetAt: usage?.resetAt ? new Date(usage.resetAt) : today,
        };
    }

    static async canUseProvider(provider: string): Promise<boolean> {
        const quota = await this.getQuota(provider);
        return quota.used < quota.limit;
    }

    static async incrementUsage(provider: string) {
        const usage = await storage.getUsage(provider);
        await storage.updateUsage(provider, (usage?.count || 0) + 1);
    }
}
