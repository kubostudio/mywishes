import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/sanitization";
import type { MessageStatus } from "@prisma/client";

type CreateMessageInput = {
    eventId: string;
    authorName?: string | null;
    content: string;
    giftId?: string | null;
};

export async function createEventMessage(input: CreateMessageInput) {
    const event = await prisma.event.findFirst({
        where: {
            id: input.eventId,
            deletedAt: null,
        },
        select: {
            id: true,
            slug: true,
        },
    });

    if (!event) {
        throw new Error("El evento no existe.");
    }

    const rawName = input.authorName ? sanitizeText(input.authorName, 100) : "";
    const authorName = rawName.length > 0 ? rawName : "Anónimo";
    const content = sanitizeText(input.content, 1000);

    if (content.length < 2) {
        throw new Error("El mensaje debe contener al menos 2 caracteres.");
    }

    let verifiedGiftId: string | null = null;
    if (input.giftId) {
        const gift = await prisma.gift.findFirst({
            where: {
                id: input.giftId,
                eventId: event.id,
                deletedAt: null,
            },
            select: { id: true },
        });
        if (gift) {
            verifiedGiftId = gift.id;
        }
    }

    return prisma.eventMessage.create({
        data: {
            eventId: event.id,
            giftId: verifiedGiftId,
            authorName,
            content,
            status: "PENDING",
        },
    });
}

export async function getApprovedMessagesByEventSlug(slug: string) {
    const event = await prisma.event.findFirst({
        where: {
            slug,
            deletedAt: null,
        },
        select: {
            id: true,
            name: true,
            honoreeName: true,
            slug: true,
            type: true,
        },
    });

    if (!event) {
        return null;
    }

    const messages = await prisma.eventMessage.findMany({
        where: {
            eventId: event.id,
            status: "APPROVED",
        },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            authorName: true,
            content: true,
            createdAt: true,
            gift: {
                select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                },
            },
        },
    });

    return {
        ...event,
        messages,
    };
}

export async function getApprovedMessagesCountByEventSlug(slug: string) {
    const event = await prisma.event.findFirst({
        where: {
            slug,
            deletedAt: null,
        },
        select: {
            id: true,
        },
    });

    if (!event) {
        return 0;
    }

    return prisma.eventMessage.count({
        where: {
            eventId: event.id,
            status: "APPROVED",
        },
    });
}

export async function getMessagesForEventCreator(creatorId: string, eventId: string) {
    const event = await prisma.event.findFirst({
        where: {
            id: eventId,
            creatorId,
            deletedAt: null,
        },
        select: {
            id: true,
            name: true,
            slug: true,
        },
    });

    if (!event) {
        throw new Error("Evento no encontrado.");
    }

    return prisma.eventMessage.findMany({
        where: {
            eventId: event.id,
        },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            authorName: true,
            content: true,
            status: true,
            createdAt: true,
            gift: {
                select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                },
            },
        },
    });
}

export async function updateEventMessageStatus(
    creatorId: string,
    eventId: string,
    messageId: string,
    status: MessageStatus
) {
    const event = await prisma.event.findFirst({
        where: {
            id: eventId,
            creatorId,
            deletedAt: null,
        },
        select: {
            id: true,
            slug: true,
        },
    });

    if (!event) {
        throw new Error("Evento no encontrado.");
    }

    const message = await prisma.eventMessage.findFirst({
        where: {
            id: messageId,
            eventId: event.id,
        },
        select: {
            id: true,
        },
    });

    if (!message) {
        throw new Error("Mensaje no encontrado.");
    }

    const updated = await prisma.eventMessage.update({
        where: {
            id: message.id,
        },
        data: {
            status,
        },
    });

    return { updated, eventSlug: event.slug };
}

export async function deleteEventMessage(
    creatorId: string,
    eventId: string,
    messageId: string
) {
    const event = await prisma.event.findFirst({
        where: {
            id: eventId,
            creatorId,
            deletedAt: null,
        },
        select: {
            id: true,
            slug: true,
        },
    });

    if (!event) {
        throw new Error("Evento no encontrado.");
    }

    const message = await prisma.eventMessage.findFirst({
        where: {
            id: messageId,
            eventId: event.id,
        },
        select: {
            id: true,
        },
    });

    if (!message) {
        throw new Error("Mensaje no encontrado.");
    }

    await prisma.eventMessage.delete({
        where: {
            id: message.id,
        },
    });

    return { eventSlug: event.slug };
}
