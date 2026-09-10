import dns from "node:dns/promises";
import net from "node:net";

/**
 * Checks if an IPv4 address is in a private, loopback, link-local, or reserved range.
 */
function isPrivateIPv4(ip: string): boolean {
    const parts = ip.split(".").map((part) => parseInt(part, 10));
    if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
        return true; // Invalid format treated as unsafe
    }

    const [a, b] = parts;

    // 0.0.0.0/8 (Current network)
    if (a === 0) return true;

    // 10.0.0.0/8 (Private)
    if (a === 10) return true;

    // 100.64.0.0/10 (Shared Address Space / CGNAT)
    if (a === 100 && b >= 64 && b <= 127) return true;

    // 127.0.0.0/8 (Loopback)
    if (a === 127) return true;

    // 169.254.0.0/16 (Link-Local / Cloud Instance Metadata)
    if (a === 169 && b === 254) return true;

    // 172.16.0.0/12 (Private)
    if (a === 172 && b >= 16 && b <= 31) return true;

    // 192.0.0.0/24 (IETF Protocol Assignments)
    if (a === 192 && b === 0 && parts[2] === 0) return true;

    // 192.168.0.0/16 (Private)
    if (a === 192 && b === 168) return true;

    // 198.18.0.0/15 (Network benchmark tests)
    if (a === 198 && (b === 18 || b === 19)) return true;

    // 224.0.0.0/4 (Multicast)
    if (a >= 224 && a <= 239) return true;

    // 240.0.0.0/4 (Reserved)
    if (a >= 240) return true;

    return false;
}

/**
 * Checks if an IPv6 address is in a private, loopback, or link-local range.
 */
function isPrivateIPv6(ip: string): boolean {
    const normalized = ip.toLowerCase().trim();

    // Loopback ::1
    if (normalized === "::1" || normalized === "0:0:0:0:0:0:0:1") return true;

    // Unspecified ::
    if (normalized === "::" || normalized === "0:0:0:0:0:0:0:0") return true;

    // IPv4-mapped IPv6 (::ffff:192.0.2.128)
    if (normalized.startsWith("::ffff:")) {
        const v4Part = normalized.replace("::ffff:", "");
        if (net.isIPv4(v4Part)) {
            return isPrivateIPv4(v4Part);
        }
    }

    // Unique Local Address fc00::/7 (fc00... or fd00...)
    if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;

    // Link-Local Unicast fe80::/10
    if (
        normalized.startsWith("fe8") ||
        normalized.startsWith("fe9") ||
        normalized.startsWith("fea") ||
        normalized.startsWith("feb")
    ) {
        return true;
    }

    return false;
}

/**
 * Checks if an IP address (v4 or v6) is internal/private/reserved.
 */
export function isPrivateIp(ip: string): boolean {
    const ipVersion = net.isIP(ip);
    if (ipVersion === 4) {
        return isPrivateIPv4(ip);
    }
    if (ipVersion === 6) {
        return isPrivateIPv6(ip);
    }
    return true; // Not a valid IP -> unsafe
}

/**
 * Validates whether a target URL is safe for server-side fetching.
 * Defends against SSRF, DNS Rebinding, and Cloud Metadata attacks.
 */
export async function validatePublicUrl(
    urlString: string
): Promise<{ safe: boolean; url?: URL; reason?: string }> {
    let parsed: URL;

    try {
        parsed = new URL(urlString.trim());
    } catch {
        return { safe: false, reason: "URL inválida." };
    }

    // Only allow http: and https: protocols
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return {
            safe: false,
            reason: `Protocolo '${parsed.protocol}' no permitido. Solo se admite http y https.`,
        };
    }

    const hostname = parsed.hostname.toLowerCase().trim();

    // Block empty hostname or localhost
    if (
        !hostname ||
        hostname === "localhost" ||
        hostname.endsWith(".localhost") ||
        hostname.endsWith(".local") ||
        hostname.endsWith(".internal")
    ) {
        return {
            safe: false,
            reason: "Acceso a dominios locales o internos no permitido.",
        };
    }

    // If hostname is directly an IP address, verify it
    if (net.isIP(hostname)) {
        if (isPrivateIp(hostname)) {
            return {
                safe: false,
                reason: "Acceso a direcciones IP privadas o de red local no permitido.",
            };
        }
    } else {
        // Resolve hostname via DNS to prevent DNS rebinding to local IPs
        try {
            const addresses = await dns.lookup(hostname, { all: true });

            if (!addresses || addresses.length === 0) {
                return {
                    safe: false,
                    reason: "No se pudo resolver el dominio ingresado.",
                };
            }

            for (const addr of addresses) {
                if (isPrivateIp(addr.address)) {
                    return {
                        safe: false,
                        reason: "El dominio resuelve a una dirección IP interna no permitida.",
                    };
                }
            }
        } catch {
            return {
                safe: false,
                reason: "No se pudo resolver la dirección del servidor remoto.",
            };
        }
    }

    return { safe: true, url: parsed };
}

/**
 * Safely fetches an external HTML page with strict SSRF defense,
 * timeout, and response body size limit (preventing memory exhaustion DoS).
 */
export async function safeFetchHtml(
    targetUrl: string,
    options: {
        maxBytes?: number;
        timeoutMs?: number;
    } = {}
): Promise<{ ok: boolean; html: string; error?: string }> {
    const maxBytes = options.maxBytes ?? 2 * 1024 * 1024; // Default 2MB limit
    const timeoutMs = options.timeoutMs ?? 5000; // Default 5 seconds

    const validation = await validatePublicUrl(targetUrl);
    if (!validation.safe || !validation.url) {
        return {
            ok: false,
            html: "",
            error: validation.reason ?? "URL no permitida por políticas de seguridad.",
        };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(validation.url.toString(), {
            signal: controller.signal,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 (MyWishes Bot)",
                Accept:
                    "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "es,en;q=0.9",
            },
            cache: "no-store",
            redirect: "follow",
        });

        if (!response.ok || !response.body) {
            return {
                ok: false,
                html: "",
                error: `El servidor remoto respondió con estado ${response.status}`,
            };
        }

        // Stream reader to enforce maxBytes limit without allocating unlimited memory
        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];
        let totalBytes = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            if (value) {
                totalBytes += value.length;
                if (totalBytes > maxBytes) {
                    controller.abort();
                    break;
                }
                chunks.push(value);
            }
        }

        const decoder = new TextDecoder("utf-8");
        const combined = new Uint8Array(totalBytes);
        let offset = 0;
        for (const chunk of chunks) {
            combined.set(chunk, offset);
            offset += chunk.length;
        }

        const html = decoder.decode(combined);
        return { ok: true, html };
    } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
            return {
                ok: false,
                html: "",
                error: "La solicitud tardó demasiado o excedió el límite de tamaño permitido.",
            };
        }
        return {
            ok: false,
            html: "",
            error: "No se pudo conectar con el sitio web del producto.",
        };
    } finally {
        clearTimeout(timeout);
    }
}
