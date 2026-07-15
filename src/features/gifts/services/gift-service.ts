import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { GiftData } from "@/features/gifts/schemas/gift-schema";

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

    return prisma.gift.create({
        data: {
            eventId: event.id,
            name: input.name,
            quantity: input.quantity || 1,
            imageUrl: input.imageUrl || null,
            brand: input.brand || null,
            price: input.price ? new Prisma.Decimal(input.price) : null,
            currency: input.currency || "PEN",
            description: input.description || null,
            color: input.color || null,
            size: input.size || null,
            dimensions: input.dimensions || null,
            originalUrl: input.originalUrl || null,
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

export async function markGiftAsPurchased(giftId: string, quantityToPurchase = 1) {
    return prisma.$transaction(async (tx) => {
        const gift = await tx.gift.findFirst({
            where: {
                id: giftId,
                deletedAt: null,
            },
            select: {
                id: true,
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

    return prisma.gift.update({
        where: {
            id: gift.id,
        },
        data: {
            name: input.name,
            quantity: input.quantity || 1,
            status:
                input.quantity > gift.purchasedQuantity ? "AVAILABLE" : "PURCHASED",
            purchasedAt:
                input.quantity > gift.purchasedQuantity ? null : new Date(),
            imageUrl: input.imageUrl || null,
            brand: input.brand || null,
            price: input.price ? new Prisma.Decimal(input.price) : null,
            currency: input.currency || "PEN",
            description: input.description || null,
            color: input.color || null,
            size: input.size || null,
            dimensions: input.dimensions || null,
            originalUrl: input.originalUrl || null,
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

    if (!giftIds.length) {
        throw new Error("No llegaron regalos para ordenar.");
    }

    const values = Prisma.join(
        giftIds.map((giftId, index) =>
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