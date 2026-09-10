import crypto from "node:crypto";
import slugify from "slugify";

export function createEventSlug(name: string): string {
    // Generate cryptographically secure random bytes for unpredictable slugs
    const random = crypto.randomBytes(3).toString("hex");

    return slugify(`${name}-${random}`, {
        lower: true,
        strict: true,
        trim: true,
    });
}