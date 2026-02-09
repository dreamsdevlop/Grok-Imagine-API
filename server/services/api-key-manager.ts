import crypto from 'node:crypto';
import { storage } from '../storage';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

export class ApiKeyManager {
    private static getEncryptionKey(): Buffer {
        const key = process.env.ENCRYPTION_KEY || 'default-fallback-key-32-chars-long!!';
        return crypto.scryptSync(key, 'salt', 32);
    }

    static encrypt(text: string): string {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, this.getEncryptionKey(), iv);

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag().toString('hex');
        return `${iv.toString('hex')}:${authTag}:${encrypted}`;
    }

    static decrypt(encryptedData: string): string {
        const [ivHex, authTagHex, encryptedText] = encryptedData.split(':');

        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, this.getEncryptionKey(), iv);

        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }

    static async getDecryptedKey(provider: string): Promise<string | undefined> {
        // 1. Check environment first (for static config)
        const envKey = process.env[`${provider.toUpperCase()}_API_KEY`] || process.env[`${provider.toUpperCase()}_KEY`];
        if (envKey) return envKey;

        // 2. Check database
        const entry = await storage.getApiKey(provider);
        if (!entry) return undefined;

        try {
            return this.decrypt(entry.key);
        } catch (e) {
            console.warn(`Failed to decrypt key for ${provider}, returning as is.`);
            return entry.key; // Fallback if it wasn't encrypted
        }
    }

    static async setEncryptedKey(provider: string, key: string): Promise<void> {
        const encrypted = this.encrypt(key);
        await storage.saveApiKey({ provider, key: encrypted });
    }
}
