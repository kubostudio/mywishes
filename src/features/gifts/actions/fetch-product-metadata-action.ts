"use server";

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

function getMetaContent(html: string, property: string) {
    const regex = new RegExp(
        `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["'][^>]*>`,
        "i"
    );

    return html.match(regex)?.[1];
}

function getTitle(html: string) {
    return html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1]?.trim();
}

function nameFromUrl(url: URL) {
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

function getJsonLdBlocks(html: string) {
    const matches = html.matchAll(
        /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    );

    return Array.from(matches)
        .map((match) => {
            try {
                return JSON.parse(match[1].trim());
            } catch {
                return null;
            }
        })
        .filter(Boolean);
}

function findProductJsonLd(blocks: unknown[]): any | null {
    for (const block of blocks) {
        if (!block || typeof block !== "object") continue;

        const data = block as any;

        if (data["@type"] === "Product") return data;

        if (Array.isArray(data["@graph"])) {
            const product = data["@graph"].find(
                (item: any) => item?.["@type"] === "Product"
            );

            if (product) return product;
        }
    }

    return null;
}

function normalizeBrand(brand: unknown) {
    if (!brand) return undefined;
    if (typeof brand === "string") return brand;

    if (typeof brand === "object" && "name" in brand) {
        return String((brand as { name?: unknown }).name ?? "");
    }

    return undefined;
}

function normalizeImage(image: unknown) {
    if (!image) return undefined;
    if (typeof image === "string") return image;

    if (Array.isArray(image)) {
        return typeof image[0] === "string" ? image[0] : undefined;
    }

    return undefined;
}

function normalizeOffer(offers: any) {
    if (!offers) return {};

    const offer = Array.isArray(offers) ? offers[0] : offers;

    return {
        price: offer?.price ? String(offer.price) : undefined,
        currency: offer?.priceCurrency ? String(offer.priceCurrency) : undefined,
    };
}

export async function fetchProductMetadataAction(
    url: string
): Promise<ProductMetadataResult> {
    try {
        const parsedUrl = new URL(url);

        let html = "";

        try {
            const response = await fetch(parsedUrl.toString(), {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                    Accept:
                        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                    "Accept-Language": "es-PE,es;q=0.9,en;q=0.8",
                },
                cache: "no-store",
            });

            if (response.ok) {
                html = await response.text();
            }
        } catch {
            html = "";
        }

        const jsonLdBlocks = html ? getJsonLdBlocks(html) : [];
        const productJsonLd = findProductJsonLd(jsonLdBlocks);
        const offer = normalizeOffer(productJsonLd?.offers);

        const title =
            productJsonLd?.name ||
            getMetaContent(html, "og:title") ||
            getMetaContent(html, "twitter:title") ||
            getTitle(html) ||
            nameFromUrl(parsedUrl);

        const imageUrl =
            normalizeImage(productJsonLd?.image) ||
            getMetaContent(html, "og:image") ||
            getMetaContent(html, "twitter:image");

        const brand =
            normalizeBrand(productJsonLd?.brand) ||
            getMetaContent(html, "product:brand") ||
            getMetaContent(html, "og:brand") ||
            "Zara";

        const price =
            offer.price ||
            getMetaContent(html, "product:price:amount") ||
            getMetaContent(html, "og:price:amount");

        const currency =
            offer.currency ||
            getMetaContent(html, "product:price:currency") ||
            getMetaContent(html, "og:price:currency") ||
            "PEN";

        return {
            success: true,
            message: html
                ? "Datos obtenidos correctamente."
                : "No se pudo leer toda la página, pero completamos datos básicos.",
            data: {
                name: title,
                imageUrl,
                brand,
                price,
                currency,
                originalUrl: parsedUrl.toString(),
            },
        };
    } catch {
        return {
            success: false,
            message: "Ingresa una URL válida.",
        };
    }
}