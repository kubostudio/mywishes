"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { getTemplateById } from "../lib/template-catalog";
import { hasUserUnlockedTemplate } from "../services/template-purchase-service";

export async function updateEventTemplateAction(
    eventId: string,
    templateId: string
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

        const template = getTemplateById(templateId);
        if (!template) {
            return {
                success: false,
                message: "Plantilla no válida.",
            };
        }

        const isUnlocked = await hasUserUnlockedTemplate(user.id, templateId);
        if (!isUnlocked) {
            return {
                success: false,
                message: "Esta plantilla es de pago. Adquiérela mediante Yape o Plin para usarla.",
            };
        }

        try {
            await prisma.event.update({
                where: { id: event.id },
                data: { template: templateId },
            });
        } catch {
            // Fallback directo por si la instancia en memoria aún no recargó la definición del campo
            await prisma.$executeRaw`UPDATE "Event" SET template = ${templateId} WHERE id = ${event.id}`;
        }

        revalidatePath(`/dashboard/eventos/${event.id}`);
        revalidatePath(`/evento/${event.slug}`);

        return {
            success: true,
            message: `Plantilla "${template.name}" activada correctamente.`,
        };
    } catch (error) {
        console.error("updateEventTemplateAction error:", error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "No se pudo actualizar la plantilla.",
        };
    }
}
