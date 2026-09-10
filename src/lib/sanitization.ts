/**
 * Security utilities for input sanitization and URL defense.
 */

// Matches ASCII control characters except \t (0x09), \n (0x0A), \r (0x0D)
const CONTROL_CHARS_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;

// Strip script and style blocks completely (including inner contents)
const SCRIPT_BLOCK_REGEX = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
const STYLE_BLOCK_REGEX = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;

// Strip any remaining HTML tags
const STRIP_HTML_REGEX = /<[^>]*>/g;

/**
 * Sanitizes generic user text inputs.
 * - Trims whitespace
 * - Normalizes Unicode to NFC
 * - Removes non-printable control characters
 * - Strips raw HTML tags to prevent HTML/XSS injection
 * - Optionally truncates to max length
 */
export function sanitizeText(
    input: unknown,
    maxLength?: number
): string {
    if (typeof input !== "string") {
        return "";
    }

    let sanitized = input
        .normalize("NFC")
        .replace(CONTROL_CHARS_REGEX, "")
        .replace(SCRIPT_BLOCK_REGEX, "")
        .replace(STYLE_BLOCK_REGEX, "")
        .replace(STRIP_HTML_REGEX, "")
        .trim();

    if (maxLength && maxLength > 0 && sanitized.length > maxLength) {
        sanitized = sanitized.slice(0, maxLength).trim();
    }

    return sanitized;
}

/**
 * Validates and sanitizes a URL.
 * Only allows valid http: or https: protocols.
 * Rejects javascript:, data:, vbscript:, file:, or malformed URLs.
 */
export function sanitizeUrl(
    url: string | null | undefined
): string | null {
    if (!url || typeof url !== "string") {
        return null;
    }

    const trimmed = url.trim();
    if (!trimmed) {
        return null;
    }

    try {
        const parsed = new URL(trimmed);

        // Strict protocol check: only http and https allowed
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            return null;
        }

        // Hostname must be present and not purely spaces
        if (!parsed.hostname || !parsed.hostname.trim()) {
            return null;
        }

        // Disallow dangerous credentials embedded in URL (e.g. http://user:pass@host)
        if (parsed.username || parsed.password) {
            parsed.username = "";
            parsed.password = "";
        }

        return parsed.toString();
    } catch {
        return null;
    }
}

/**
 * Returns a safe external URL for <a href> and window.open in React components.
 * Returns undefined if URL is empty, invalid, or dangerous.
 */
export function getSafeExternalUrl(
    url: string | null | undefined
): string | undefined {
    const safe = sanitizeUrl(url);
    return safe ?? undefined;
}

/**
 * Validates and normalizes callback URLs to prevent Open Redirect attacks.
 * Only allows relative paths starting with a single '/' (e.g. '/dashboard').
 * Disallows protocol-relative URLs ('//evil.com') or backslash tricks ('/\\evil.com').
 */
export function getSafeCallbackUrl(
    url: string | null | undefined,
    fallback: string = "/dashboard"
): string {
    if (!url || typeof url !== "string") {
        return fallback;
    }

    const trimmed = url.trim().replace(CONTROL_CHARS_REGEX, "");

    // Must be a relative path: starts with '/', but not '//' or '/\'
    if (
        trimmed.startsWith("/") &&
        !trimmed.startsWith("//") &&
        !trimmed.startsWith("/\\")
    ) {
        // Prevent CRLF injection or embedded tabs
        if (!/[\r\n\t]/.test(trimmed)) {
            return trimmed;
        }
    }

    return fallback;
}
