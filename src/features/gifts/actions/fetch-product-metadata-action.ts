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

        const response = await fetch(parsedUrl.toString(), {
            headers: {
                "User-Agent": "Mozilla/5.0",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            return {
                success: false,
                message: "No se pudo leer la página del producto.",
            };
        }

        const html = await response.text();

        const jsonLdBlocks = getJsonLdBlocks(html);
        const productJsonLd = findProductJsonLd(jsonLdBlocks);
        const offer = normalizeOffer(productJsonLd?.offers);

        const title =
            productJsonLd?.name ||
            getMetaContent(html, "og:title") ||
            getMetaContent(html, "twitter:title");

        const imageUrl =
            normalizeImage(productJsonLd?.image) ||
            getMetaContent(html, "og:image") ||
            getMetaContent(html, "twitter:image");

        const brand =
            normalizeBrand(productJsonLd?.brand) ||
            getMetaContent(html, "product:brand") ||
            getMetaContent(html, "og:brand");

        const price =
            offer.price ||
            getMetaContent(html, "product:price:amount") ||
            getMetaContent(html, "og:price:amount");

        const currency =
            offer.currency ||
            getMetaContent(html, "product:price:currency") ||
            getMetaContent(html, "og:price:currency");

        return {
            success: true,
            message: "Datos obtenidos correctamente.",
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