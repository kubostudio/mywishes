"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import type { CustomThemeConfig } from "../types";

export async function saveCustomThemeAction(
    eventId: string,
    customTheme: CustomThemeConfig
) {
    try {
        const user = await requireUser();

        const event = await prisma.event.findFirst({
            where: {
                id: eventId,
                creatorId: user.id,
                deletedAt: null,
            },
            select: {
                id: true,
                slug: true,
            },
        });

        if (!event) {
            return {
                success: false,
                message: "Evento no encontrado o sin permisos.",
            };
        }

        if (!customTheme || typeof customTheme !== "object") {
            return {
                success: false,
                message: "Configuración de tema inválida.",
            };
        }

        try {
            await prisma.event.update({
                where: { id: event.id },
                data: {
                    template: "custom",
                    customTheme: customTheme as unknown as import("@prisma/client").Prisma.InputJsonValue,
                },
            });
        } catch {
            // Fallback con SQL directo
            await prisma.$executeRaw`UPDATE "Event" SET template = 'custom', "customTheme" = ${JSON.stringify(customTheme)}::jsonb WHERE id = ${event.id}`;
        }

        revalidatePath(`/dashboard/eventos/${event.id}`);
        revalidatePath(`/evento/${event.slug}`);

        return {
            success: true,
            message: "Tema personalizado guardado y aplicado con éxito.",
        };
    } catch (error) {
        console.error("saveCustomThemeAction error:", error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "No se pudo guardar el tema personalizado.",
        };
    }
}
