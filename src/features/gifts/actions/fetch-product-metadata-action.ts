"use server";

import { requireUser } from "@/lib/auth-session";
import { getClientIp, rateLimits } from "@/lib/rate-limit";
import { safeFetchHtml, validatePublicUrl } from "@/lib/ssrf";
import { sanitizeText, sanitizeUrl } from "@/lib/sanitization";

type ProductMetadataResult = {
    success: boolean;
    message: string;
    data?: {
        name?: string;
        imageUrl?: string;
        brand?: string;
        price?: string;
        currency?: string;
        originalUrl: string;
    };
};

function getMetaContent(html: string, property: string): string | undefined {
    const escaped = property.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(
        `<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`,
        "i"
    );

    return html.match(regex)?.[1];
}

function getTitle(html: string): string | undefined {
    return html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1]?.trim();
}

function nameFromUrl(url: URL): string | undefined {
    const lastPath = url.pathname.split("/").filter(Boolean).at(-1);

    if (!lastPath) return undefined;

    return lastPath
        .replace(/\.html$/i, "")
        .replace(/p\d+/gi, "")
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getJsonLdBlocks(html: string): unknown[] {
    const matches = html.matchAll(
        /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    );

    return Array.from(matches)
        .map((match) => {
            try {
                // Safeguard against gigantic script contents
                if (match[1].length > 200_000) return null;
                return JSON.parse(match[1].trim());
            } catch {
                return null;
            }
        })
        .filter(Boolean);
}

function findProductJsonLd(blocks: unknown[]): Record<string, unknown> | null {
    for (const block of blocks) {
        if (!block || typeof block !== "object") continue;

        const data = block as Record<string, unknown>;

        if (data["@type"] === "Product") return data;

        if (Array.isArray(data["@graph"])) {
            const product = data["@graph"].find(
                (item: unknown) =>
                    item &&
                    typeof item === "object" &&
                    (item as Record<string, unknown>)["@type"] === "Product"
            );

            if (product) return product as Record<string, unknown>;
        }
    }

    return null;
}

function normalizeBrand(brand: unknown): string | undefined {
    if (!brand) return undefined;
    if (typeof brand === "string") return brand;

    if (typeof brand === "object" && "name" in brand) {
        return String((brand as { name?: unknown }).name ?? "");
    }

    return undefined;
}

function normalizeImage(image: unknown): string | undefined {
    if (!image) return undefined;
    if (typeof image === "string") return image;

    if (Array.isArray(image)) {
        return typeof image[0] === "string" ? image[0] : undefined;
    }

    return undefined;
}

function normalizeOffer(offers: unknown): { price?: string; currency?: string } {
    if (!offers) return {};

    const offer = Array.isArray(offers) ? offers[0] : (offers as Record<string, unknown>);

    return {
        price: offer?.price ? String(offer.price) : undefined,
        currency: offer?.priceCurrency ? String(offer.priceCurrency) : undefined,
    };
}

export async function fetchProductMetadataAction(
    rawUrl: string
): Promise<ProductMetadataResult> {
    try {
        // 1. Authorization: Only authenticated users can trigger scraping
        const user = await requireUser();

        // 2. Rate limiting: limit per user ID and per client IP
        const clientIp = await getClientIp();
        const ipLimit = rateLimits.productMetadata(clientIp);
        const userLimit = rateLimits.productMetadata(user.id);

        if (!ipLimit.success || !userLimit.success) {
            const retryAfter = Math.max(ipLimit.retryAfterSeconds, userLimit.retryAfterSeconds);
            return {
                success: false,
                message: `Demasiadas solicitudes. Por favor, espera ${retryAfter} segundos.`,
            };
        }

        // 3. Input Sanitization & SSRF Defense: Validate URL scheme, hostname, and private IPs
        const validation = await validatePublicUrl(rawUrl);
        if (!validation.safe || !validation.url) {
            return {
                success: false,
                message: validation.reason ?? "La URL ingresada no es válida o no está permitida.",
            };
        }

        const safeUrl = validation.url;

        // 4. Safe Fetching: Timeout at 5s, max 2MB to prevent memory exhaustion DoS
        const fetchResult = await safeFetchHtml(safeUrl.toString(), {
            maxBytes: 2 * 1024 * 1024,
            timeoutMs: 5000,
        });

        const html = fetchResult.ok ? fetchResult.html : "";

        // 5. Extract metadata
        const jsonLdBlocks = html ? getJsonLdBlocks(html) : [];
        const productJsonLd = findProductJsonLd(jsonLdBlocks);
        const offer = normalizeOffer(productJsonLd?.offers);

        const rawTitle =
            (typeof productJsonLd?.name === "string" ? productJsonLd.name : undefined) ||
            getMetaContent(html, "og:title") ||
            getMetaContent(html, "twitter:title") ||
            getTitle(html) ||
            nameFromUrl(safeUrl);

        const rawImageUrl =
            normalizeImage(productJsonLd?.image) ||
            getMetaContent(html, "og:image") ||
            getMetaContent(html, "twitter:image");

        const rawBrand =
            normalizeBrand(productJsonLd?.brand) ||
            getMetaContent(html, "product:brand") ||
            getMetaContent(html, "og:brand");

        const rawPrice =
            offer.price ||
            getMetaContent(html, "product:price:amount") ||
            getMetaContent(html, "og:price:amount");

        const rawCurrency =
            offer.currency ||
            getMetaContent(html, "product:price:currency") ||
            getMetaContent(html, "og:price:currency") ||
            "PEN";

        // 6. Sanitize all extracted fields before returning to client
        const sanitizedTitle = rawTitle ? sanitizeText(rawTitle, 150) : undefined;
        const sanitizedImageUrl = rawImageUrl ? sanitizeUrl(rawImageUrl) ?? undefined : undefined;
        const sanitizedBrand = rawBrand ? sanitizeText(rawBrand, 100) : undefined;

        // Validate price format if found
        let sanitizedPrice: string | undefined = undefined;
        if (rawPrice && /^\d+(\.\d{1,2})?$/.test(rawPrice.trim())) {
            sanitizedPrice = rawPrice.trim();
        }

        // Validate currency format
        let sanitizedCurrency = "PEN";
        if (rawCurrency && /^[A-Z]{3}$/i.test(rawCurrency.trim())) {
            sanitizedCurrency = rawCurrency.trim().toUpperCase();
        }

        return {
            success: true,
            message: html
                ? "Datos obtenidos correctamente."
                : "No se pudo leer toda la página, pero guardamos el enlace.",
            data: {
                name: sanitizedTitle,
                imageUrl: sanitizedImageUrl,
                brand: sanitizedBrand,
                price: sanitizedPrice,
                currency: sanitizedCurrency,
                originalUrl: safeUrl.toString(),
            },
        };
    } catch {
        return {
            success: false,
            message: "No se pudo obtener la información de la URL proporcionada.",
        };
    }
}