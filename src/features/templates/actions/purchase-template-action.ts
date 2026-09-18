"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { getTemplateById } from "../lib/template-catalog";
import { recordTemplatePurchase } from "../services/template-purchase-service";
import type { TemplatePaymentMethod } from "@prisma/client";

type PurchaseTemplateInput = {
    templateId: string;
    eventId?: string;
    paymentMethod: TemplatePaymentMethod;
    operationCode?: string;
};

export async function purchaseTemplateAction(input: PurchaseTemplateInput) {
    try {
        const user = await requireUser();
        const template = getTemplateById(input.templateId);

        if (!template) {
            return {
                success: false,
                message: "La plantilla seleccionada no existe.",
            };
        }

        // Registrar la compra en base de datos
        await recordTemplatePurchase({
            userId: user.id,
            templateId: input.templateId,
            eventId: input.eventId,
            amount: template.price,
            paymentMethod: input.paymentMethod,
            operationCode: input.operationCode,
        });

        // Si se indicó un evento, aplicar la plantilla comprada de una vez
        if (input.eventId) {
            const event = await prisma.event.findFirst({
                where: {
                    id: input.eventId,
                    creatorId: user.id,
                },
                select: {
                    id: true,
                    slug: true,
                },
            });

            if (event) {
                try {
                    await prisma.event.update({
                        where: { id: event.id },
                        data: { template: input.templateId },
                    });
                } catch {
                    await prisma.$executeRaw`UPDATE "Event" SET template = ${input.templateId} WHERE id = ${event.id}`;
                }

                revalidatePath(`/dashboard/eventos/${event.id}`);
                revalidatePath(`/evento/${event.slug}`);
            }
        }

        return {
            success: true,
            message: `¡Pago registrado! La plantilla "${template.name}" ha sido desbloqueada.`,
        };
    } catch (error) {
        console.error("purchaseTemplateAction error:", error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "No se pudo procesar la compra. Intenta nuevamente.",
        };
    }
}
