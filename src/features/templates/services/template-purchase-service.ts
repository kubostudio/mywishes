import { prisma } from "@/lib/prisma";
import { isFreeTemplate } from "../lib/template-catalog";
import type { TemplatePaymentMethod } from "@prisma/client";

export async function getUserPurchasedTemplateIds(userId: string): Promise<string[]> {
    if (prisma.templatePurchase) {
        try {
            const purchases = await prisma.templatePurchase.findMany({
                where: {
                    userId,
                    status: {
                        in: ["APPROVED", "PENDING"], // Permite uso inmediato tras enviar comprobante
                    },
                },
                select: {
                    templateId: true,
                },
            });

            return purchases.map((p) => p.templateId);
        } catch {
            // Continúa a fallback si la instancia generada falla
        }
    }

    try {
        const rows = await prisma.$queryRaw<{ templateId: string }[]>`
            SELECT "templateId" FROM "TemplatePurchase"
            WHERE "userId" = ${userId} AND status IN ('APPROVED', 'PENDING')
        `;
        return rows.map((r) => r.templateId);
    } catch {
        return [];
    }
}

export async function hasUserUnlockedTemplate(
    userId: string,
    templateId: string
): Promise<boolean> {
    if (isFreeTemplate(templateId)) {
        return true;
    }

    if (prisma.templatePurchase) {
        try {
            const purchase = await prisma.templatePurchase.findFirst({
                where: {
                    userId,
                    templateId,
                    status: {
                        in: ["APPROVED", "PENDING"],
                    },
                },
            });

            return Boolean(purchase);
        } catch {
            // Continúa a fallback si la instancia generada falla
        }
    }

    try {
        const rows = await prisma.$queryRaw<{ id: string }[]>`
            SELECT id FROM "TemplatePurchase"
            WHERE "userId" = ${userId} AND "templateId" = ${templateId} AND status IN ('APPROVED', 'PENDING')
            LIMIT 1
        `;
        return rows.length > 0;
    } catch {
        return false;
    }
}

export async function recordTemplatePurchase(input: {
    userId: string;
    templateId: string;
    eventId?: string;
    amount: number;
    paymentMethod: TemplatePaymentMethod;
    operationCode?: string;
}) {
    if (prisma.templatePurchase) {
        try {
            return await prisma.templatePurchase.create({
                data: {
                    userId: input.userId,
                    templateId: input.templateId,
                    eventId: input.eventId || null,
                    amount: input.amount,
                    currency: "PEN",
                    paymentMethod: input.paymentMethod,
                    status: "APPROVED", // Desbloqueado para acceso inmediato del cliente
                    operationCode: input.operationCode?.trim() || null,
                },
            });
        } catch {
            // Continúa a fallback si la instancia generada falla
        }
    }

    // Fallback SQL directo si la instancia de Prisma en memoria aún no recargó el modelo
    const id = `tp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await prisma.$executeRaw`
        INSERT INTO "TemplatePurchase" (id, "userId", "templateId", "eventId", amount, currency, "paymentMethod", status, "operationCode", "createdAt", "updatedAt")
        VALUES (
            ${id},
            ${input.userId},
            ${input.templateId},
            ${input.eventId || null},
            ${input.amount},
            'PEN',
            ${input.paymentMethod}::"TemplatePaymentMethod",
            'APPROVED'::"TemplatePurchaseStatus",
            ${input.operationCode?.trim() || null},
            NOW(),
            NOW()
        )
    `;
    return { id };
}
