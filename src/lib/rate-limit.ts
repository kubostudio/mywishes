import { headers } from "next/headers";

/**
 * Sliding Window Rate Limiter
 * Tracks timestamp hits per key and automatically clears expired entries.
 */
type RateLimitRecord = {
    timestamps: number[];
};

class InMemoryRateLimiter {
    private store = new Map<string, RateLimitRecord>();
    private cleanupTimer: NodeJS.Timeout | null = null;

    constructor() {
        // Run cleanup every 60 seconds, unreferenced so it does not hold the Node process alive
        if (typeof setInterval !== "undefined") {
            this.cleanupTimer = setInterval(() => {
                this.cleanup();
            }, 60 * 1000);

            if (this.cleanupTimer.unref) {
                this.cleanupTimer.unref();
            }
        }
    }

    private cleanup() {
        const now = Date.now();
        for (const [key, record] of this.store.entries()) {
            // Remove timestamps older than 1 hour
            const valid = record.timestamps.filter((ts) => now - ts < 60 * 60 * 1000);
            if (valid.length === 0) {
                this.store.delete(key);
            } else {
                record.timestamps = valid;
            }
        }
    }

    /**
     * Check if a request is allowed under the rate limit.
     * If allowed, records the hit and returns success: true.
     * If limit exceeded, returns success: false along with retryAfterSeconds.
     */
    public check(
        key: string,
        limit: number,
        windowMs: number
    ): { success: boolean; remaining: number; retryAfterSeconds: number } {
        const now = Date.now();
        const windowStart = now - windowMs;

        let record = this.store.get(key);
        if (!record) {
            record = { timestamps: [] };
            this.store.set(key, record);
        }

        // Filter out timestamps outside the current window
        record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

        if (record.timestamps.length >= limit) {
            const oldestInWindow = record.timestamps[0];
            const retryAfterMs = oldestInWindow + windowMs - now;
            const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));

            return {
                success: false,
                remaining: 0,
                retryAfterSeconds,
            };
        }

        // Record current hit
        record.timestamps.push(now);

        return {
            success: true,
            remaining: Math.max(0, limit - record.timestamps.length),
            retryAfterSeconds: 0,
        };
    }

    /**
     * Resets a specific key (e.g. after a successful login)
     */
    public reset(key: string) {
        this.store.delete(key);
    }
}

// Global singleton rate limiter instance
const rateLimiterInstance = new InMemoryRateLimiter();

/**
 * Extracts client IP from incoming Next.js request headers
 */
export async function getClientIp(): Promise<string> {
    try {
        const headersList = await headers();
        const forwardedFor = headersList.get("x-forwarded-for");
        if (forwardedFor) {
            const firstIp = forwardedFor.split(",")[0].trim();
            if (firstIp) return firstIp;
        }

        const realIp = headersList.get("x-real-ip");
        if (realIp) return realIp.trim();

        const cfConnectingIp = headersList.get("cf-connecting-ip");
        if (cfConnectingIp) return cfConnectingIp.trim();

        return "127.0.0.1";
    } catch {
        return "127.0.0.1";
    }
}

/**
 * Rate limit configurations
 */
export const rateLimits = {
    // Auth login attempts: 5 per 15 minutes per email, 30 per 15 min per IP
    auth: {
        checkEmail: (email: string) =>
            rateLimiterInstance.check(`auth:email:${email.toLowerCase().trim()}`, 5, 15 * 60 * 1000),
        checkIp: (ip: string) =>
            rateLimiterInstance.check(`auth:ip:${ip}`, 30, 15 * 60 * 1000),
        resetEmail: (email: string) =>
            rateLimiterInstance.reset(`auth:email:${email.toLowerCase().trim()}`),
    },

    // Account registration: max 5 per hour per IP
    register: (ip: string) =>
        rateLimiterInstance.check(`register:${ip}`, 5, 60 * 60 * 1000),

    // External metadata fetching: max 10 requests per minute per user/IP
    productMetadata: (identifier: string) =>
        rateLimiterInstance.check(`metadata:${identifier}`, 10, 60 * 1000),

    // Public gift purchase: max 15 purchases per minute per IP
    publicGiftPurchase: (ip: string) =>
        rateLimiterInstance.check(`public-purchase:${ip}`, 15, 60 * 1000),

    // Public messages/dedications: max 10 messages per minute per IP
    publicMessage: (ip: string) =>
        rateLimiterInstance.check(`public-msg:${ip}`, 10, 60 * 1000),

    // General user mutations (create/update event/gift): max 40 per minute per user
    mutation: (userId: string) =>
        rateLimiterInstance.check(`mutation:${userId}`, 40, 60 * 1000),
};
