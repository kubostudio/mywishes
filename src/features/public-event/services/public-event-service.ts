import { prisma } from "@/lib/prisma";

export async function getPublicEventBySlug(slug: string) {
    return prisma.event.findFirst({
        where: {
            slug,
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