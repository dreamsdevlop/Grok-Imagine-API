import { storage } from '../storage';
import { FreeQuotaManager } from './free-quota-manager';

export class UsageTracker {
    static async track(provider: string, model: string, type: 'chat' | 'image' | 'video' = 'chat') {
        try {
            await FreeQuotaManager.incrementUsage(provider);
            console.log(`[Usage] Provider: ${provider}, Model: ${model}, Type: ${type}`);
        } catch (error) {
            console.error("Failed to track usage:", error);
        }
    }

    static async getReports() {
        // In a real app, we might aggregate from a logs table
        // For now, we return the counts from the usage table
        // This is a placeholder for more complex analytics
        return [];
    }
}
