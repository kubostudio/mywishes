import { prisma } from "@/lib/prisma";
import { createEventSlug } from "@/features/events/lib/create-event-slug";
import type { EventInput } from "@/features/events/schemas/event-schema";
import { sanitizeText, sanitizeUrl } from "@/lib/sanitization";

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

    const sanitizedName = sanitizeText(input.name, 150);
    const sanitizedHonoree = input.honoreeName ? sanitizeText(input.honoreeName, 100) : null;
    const sanitizedDressCode = input.dressCode ? sanitizeText(input.dressCode, 100) : null;
    const sanitizedLocation = sanitizeText(input.location, 255);
    const safeLocationURL = sanitizeUrl(input.locationURL) || "";
    const sanitizedDescription = input.description ? sanitizeText(input.description, 2000) : null;

    return prisma.event.create({
        data: {
            type: input.type,
            name: sanitizedName,

            honoreeName:
                input.type === "GENDER_REVEAL" ||
                input.type === "CHRISTMAS"
                    ? null
                    : sanitizedHonoree,

            gender:
                input.type === "GENDER_REVEAL" ||
                input.type === "CHRISTMAS"
                    ? null
                    : input.gender,

            birthdayAge:
                input.type === "BIRTHDAY"
                    ? input.birthdayAge
                    : null,

            dressCode: sanitizedDressCode,

            date: new Date(input.date),

            endDate: input.endDate
                ? new Date(input.endDate)
                : null,

            timezone: input.timezone ? sanitizeText(input.timezone, 100) : null,

            location: sanitizedLocation,
            locationURL: safeLocationURL,
            description: sanitizedDescription,

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

    const sanitizedName = sanitizeText(input.name, 150);
    const sanitizedHonoree = input.honoreeName ? sanitizeText(input.honoreeName, 100) : null;
    const sanitizedDressCode = input.dressCode ? sanitizeText(input.dressCode, 100) : null;
    const sanitizedLocation = sanitizeText(input.location, 255);
    const safeLocationURL = sanitizeUrl(input.locationURL) || "";
    const sanitizedDescription = input.description ? sanitizeText(input.description, 2000) : null;

    return prisma.event.update({
        where: {
            id: event.id,
        },
        data: {
            type: input.type,
            name: sanitizedName,

            honoreeName:
                input.type === "GENDER_REVEAL" ||
                input.type === "CHRISTMAS"
                    ? null
                    : sanitizedHonoree,

            gender:
                input.type === "GENDER_REVEAL" ||
                input.type === "CHRISTMAS"
                    ? null
                    : input.gender,

            birthdayAge:
                input.type === "BIRTHDAY"
                    ? input.birthdayAge
                    : null,

            dressCode: sanitizedDressCode,

            date: new Date(input.date),
            endDate: input.endDate
                ? new Date(input.endDate)
                : null,
            timezone: input.timezone ? sanitizeText(input.timezone, 100) : null,

            location: sanitizedLocation,
            locationURL: safeLocationURL,
            description: sanitizedDescription,
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