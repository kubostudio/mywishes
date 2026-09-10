import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { GiftData } from "@/features/gifts/schemas/gift-schema";
import { sanitizeText, sanitizeUrl } from "@/lib/sanitization";

export async function createGift(creatorId: string, input: GiftData) {
    const event = await prisma.event.findFirst({
        where: {
            id: input.eventId,
            creatorId,
            deletedAt: null,
        },
        select: {
            id: true,
            gifts: {
                where: {
                    deletedAt: null,
                },
                select: {
                    position: true,
                },
                orderBy: {
                    position: "desc",
                },
                take: 1,
            },
        },
    });

    if (!event) {
        throw new Error("Evento no encontrado.");
    }

    const nextPosition = (event.gifts[0]?.position ?? -1) + 1;
    const safeQuantity = Math.min(Math.max(1, input.quantity || 1), 9999);

    return prisma.gift.create({
        data: {
            eventId: event.id,
            name: sanitizeText(input.name, 150),
            quantity: safeQuantity,
            imageUrl: sanitizeUrl(input.imageUrl),
            brand: input.brand ? sanitizeText(input.brand, 100) : null,
            price: input.price ? new Prisma.Decimal(input.price) : null,
            currency: (input.currency || "PEN").toUpperCase().slice(0, 3),
            description: input.description ? sanitizeText(input.description, 2000) : null,
            color: input.color ? sanitizeText(input.color, 50) : null,
            size: input.size ? sanitizeText(input.size, 50) : null,
            dimensions: input.dimensions ? sanitizeText(input.dimensions, 50) : null,
            originalUrl: sanitizeUrl(input.originalUrl),
            position: nextPosition,
        },
    });
}

export async function softDeleteGift(creatorId: string, giftId: string) {
    const gift = await prisma.gift.findFirst({
        where: {
            id: giftId,
            deletedAt: null,
            event: {
                creatorId,
                deletedAt: null,
            },
        },
        select: {
            id: true,
            eventId: true,
        },
    });

    if (!gift) {
        throw new Error("Regalo no encontrado.");
    }

    return prisma.gift.update({
        where: {
            id: gift.id,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}

export async function markGiftAsPurchased(
    giftId: string,
    eventSlug: string,
    quantityToPurchase = 1
) {
    return prisma.$transaction(async (tx) => {
        // Enforce that gift belongs to the active event with eventSlug
        const gift = await tx.gift.findFirst({
            where: {
                id: giftId,
                deletedAt: null,
                event: {
                    slug: eventSlug,
                    deletedAt: null,
                },
            },
            select: {
                id: true,
                eventId: true,
                quantity: true,
                purchasedQuantity: true,
                status: true,
            },
        });

        if (!gift) {
            throw new Error("Regalo no encontrado.");
        }

        if (gift.status === "PURCHASED") {
            throw new Error("El regalo ya fue comprado.");
        }

        const remainingQuantity = gift.quantity - gift.purchasedQuantity;

        if (quantityToPurchase < 1 || quantityToPurchase > remainingQuantity) {
            throw new Error("Cantidad inválida.");
        }

        const nextPurchasedQuantity = gift.purchasedQuantity + quantityToPurchase;

        const nextStatus =
            nextPurchasedQuantity >= gift.quantity ? "PURCHASED" : "AVAILABLE";

        return tx.gift.update({
            where: {
                id: gift.id,
            },
            data: {
                purchasedQuantity: nextPurchasedQuantity,
                status: nextStatus,
                purchasedAt: nextStatus === "PURCHASED" ? new Date() : null,
            },
        });
    });
}

export async function setGiftAvailableQuantity(
    creatorId: string,
    giftId: string,
    availableQuantity: number
) {
    const gift = await prisma.gift.findFirst({
        where: {
            id: giftId,
            deletedAt: null,
            event: {
                creatorId,
                deletedAt: null,
            },
        },
        select: {
            id: true,
            quantity: true,
        },
    });

    if (!gift) {
        throw new Error("Regalo no encontrado.");
    }

    if (
        availableQuantity < 1 ||
        availableQuantity > gift.quantity
    ) {
        throw new Error("Cantidad disponible inválida.");
    }

    const purchasedQuantity =
        gift.quantity - availableQuantity;

    return prisma.gift.update({
        where: {
            id: gift.id,
        },
        data: {
            purchasedQuantity,
            status:
                purchasedQuantity >= gift.quantity
                    ? "PURCHASED"
                    : "AVAILABLE",
            purchasedAt:
                purchasedQuantity >= gift.quantity
                    ? new Date()
                    : null,
        },
    });
}

export async function markGiftAsAvailable(
    creatorId: string,
    giftId: string
) {
    const gift = await prisma.gift.findFirst({
        where: {
            id: giftId,
            deletedAt: null,
            event: {
                creatorId,
                deletedAt: null,
            },
        },
        select: {
            id: true,
            eventId: true,
            purchasedQuantity: true,
            status: true,
        },
    });

    if (!gift) {
        throw new Error("Regalo no encontrado.");
    }

    if (gift.purchasedQuantity === 0 && gift.status === "AVAILABLE") {
        throw new Error("El regalo ya está disponible.");
    }

    return prisma.gift.update({
        where: {
            id: gift.id,
        },
        data: {
            status: "AVAILABLE",
            purchasedQuantity: 0,
            purchasedAt: null,
        },
    });
}

export async function updateGift(
    creatorId: string,
    giftId: string,
    input: GiftData
) {
    const gift = await prisma.gift.findFirst({
        where: {
            id: giftId,
            deletedAt: null,
            event: {
                id: input.eventId,
                creatorId,
                deletedAt: null,
            },
        },
        select: {
            id: true,
            eventId: true,
            purchasedQuantity: true,
        },
    });

    if (!gift) {
        throw new Error("Regalo no encontrado.");
    }

    const safeQuantity = Math.min(Math.max(1, input.quantity || 1), 9999);

    return prisma.gift.update({
        where: {
            id: gift.id,
        },
        data: {
            name: sanitizeText(input.name, 150),
            quantity: safeQuantity,
            status:
                safeQuantity > gift.purchasedQuantity ? "AVAILABLE" : "PURCHASED",
            purchasedAt:
                safeQuantity > gift.purchasedQuantity ? null : new Date(),
            imageUrl: sanitizeUrl(input.imageUrl),
            brand: input.brand ? sanitizeText(input.brand, 100) : null,
            price: input.price ? new Prisma.Decimal(input.price) : null,
            currency: (input.currency || "PEN").toUpperCase().slice(0, 3),
            description: input.description ? sanitizeText(input.description, 2000) : null,
            color: input.color ? sanitizeText(input.color, 50) : null,
            size: input.size ? sanitizeText(input.size, 50) : null,
            dimensions: input.dimensions ? sanitizeText(input.dimensions, 50) : null,
            originalUrl: sanitizeUrl(input.originalUrl),
        },
    });
}

export async function reorderGifts(
    creatorId: string,
    eventId: string,
    giftIds: string[]
) {
    const event = await prisma.event.findFirst({
        where: {
            id: eventId,
            creatorId,
            deletedAt: null,
        },
        select: {
            id: true,
        },
    });

    if (!event) {
        throw new Error("Evento no encontrado.");
    }

    const uniqueGiftIds = Array.from(
        new Set(giftIds.filter((id) => typeof id === "string" && id.trim().length > 0))
    );

    if (!uniqueGiftIds.length) {
        throw new Error("No llegaron regalos para ordenar.");
    }

    const values = Prisma.join(
        uniqueGiftIds.map((giftId, index) =>
            Prisma.sql`(${giftId}::text, ${index}::int)`
        )
    );

    await prisma.$executeRaw`
    UPDATE "Gift" AS g
    SET "position" = v.position
    FROM (
      VALUES ${values}
    ) AS v(id, position)
    WHERE g.id = v.id
      AND g."eventId" = ${eventId}
      AND g."deletedAt" IS NULL
  `;
}