import { prisma } from "@/lib/prisma";
import { createEventSlug } from "@/features/events/lib/create-event-slug";
import type { EventInput } from "@/features/events/schemas/event-schema";

export async function getEventsByCreatorId(creatorId: string) {
    return prisma.event.findMany({
        where: {
            creatorId,
            deletedAt: null,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function createEvent(creatorId: string, input: EventInput) {
    const slug = createEventSlug(input.name);

    return prisma.event.create({
        data: {
            type: input.type,
            name: input.name,

            honoreeName:
                input.type === "GENDER_REVEAL" ||
                input.type === "CHRISTMAS"
                    ? null
                    : input.honoreeName,

            gender:
                input.type === "GENDER_REVEAL" ||
                input.type === "CHRISTMAS"
                    ? null
                    : input.gender,

            birthdayAge:
                input.type === "BIRTHDAY"
                    ? input.birthdayAge
                    : null,

            dressCode: input.dressCode || null,

            date: new Date(input.date),

            endDate: input.endDate
                ? new Date(input.endDate)
                : null,

            timezone: input.timezone,

            location: input.location,
            locationURL: input.locationURL,
            description: input.description || null,

            slug,
            creatorId,
        },
    });
}

export async function getEventByIdForCreator(eventId: string, creatorId: string) {
    return prisma.event.findFirst({
        where: {
            id: eventId,
            creatorId,
            deletedAt: null,
        },
        include: {
            gifts: {
                where: {
                    deletedAt: null,
                },
                orderBy: {
                    position: "asc",
                },
            },
        },
    });
}

export async function updateEvent(
    creatorId: string,
    eventId: string,
    input: EventInput
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

    return prisma.event.update({
        where: {
            id: event.id,
        },
        data: {
            type: input.type,
            name: input.name,

            honoreeName:
                input.type === "GENDER_REVEAL" ||
                input.type === "CHRISTMAS"
                    ? null
                    : input.honoreeName,

            gender:
                input.type === "GENDER_REVEAL" ||
                input.type === "CHRISTMAS"
                    ? null
                    : input.gender,

            birthdayAge:
                input.type === "BIRTHDAY"
                    ? input.birthdayAge
                    : null,

            dressCode: input.dressCode || null,

            date: new Date(input.date),
            endDate: input.endDate
                ? new Date(input.endDate)
                : null,
            timezone: input.timezone,

            location: input.location,
            locationURL: input.locationURL,
            description: input.description || null,
        },
    });
}

export async function softDeleteEvent(creatorId: string, eventId: string) {
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

    return prisma.event.update({
        where: {
            id: event.id,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}