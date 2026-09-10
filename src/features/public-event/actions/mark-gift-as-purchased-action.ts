"use server";

import { revalidatePath } from "next/cache";

import { markGiftAsPurchased } from "@/features/gifts/services/gift-service";
import { purchaseGiftSchema } from "@/features/public-event/schemas/purchase-gift-schema";
import { createEventMessage } from "@/features/messages/services/message-service";
import { getClientIp, rateLimits } from "@/lib/rate-limit";

type MarkGiftResult = {
    success: boolean;
    message: string;
};

export async function markGiftAsPurchasedAction(
    giftId: string,
    eventSlug: string,
    quantityToPurchase = 1,
    guestName?: string,
    guestMessage?: string,
    showGiftInDedication = true
): Promise<MarkGiftResult> {
    try {
        // 1. Rate limiting by IP (max 15 gift purchases per minute per IP)
        const clientIp = await getClientIp();
        const ipLimit = rateLimits.publicGiftPurchase(clientIp);

        if (!ipLimit.success) {
            return {
                success: false,
                message: "Has realizado demasiadas solicitudes recientemente. Por favor espera un momento.",
            };
        }

        // 2. Strict Zod schema validation
        const parsed = purchaseGiftSchema.safeParse({
            giftId,
            eventSlug,
            quantityToPurchase,
            guestName,
            guestMessage,
            showGiftInDedication,
        });

        if (!parsed.success) {
            return {
                success: false,
                message: "Datos de selección de regalo inválidos.",
            };
        }

        // 3. Mark as purchased with event ownership verification
        const updatedGift = await markGiftAsPurchased(
            parsed.data.giftId,
            parsed.data.eventSlug,
            parsed.data.quantityToPurchase
        );

        // 4. If guest left a message/dedication, create it in PENDING state
        let messageSaved = false;
        if (parsed.data.guestMessage && parsed.data.guestMessage.trim().length >= 2) {
            try {
                await createEventMessage({
                    eventId: updatedGift.eventId,
                    authorName: parsed.data.guestName,
                    content: parsed.data.guestMessage,
                    giftId: parsed.data.showGiftInDedication ? updatedGift.id : undefined,
                });
                messageSaved = true;
            } catch (msgErr) {
                console.error("Error creating event message during purchase:", msgErr);
            }
        }

        revalidatePath(`/evento/${parsed.data.eventSlug}`);
        revalidatePath(`/evento/${parsed.data.eventSlug}/mensajes`);
        revalidatePath(`/dashboard/eventos/${updatedGift.eventId}`);

        return {
            success: true,
            message: messageSaved
                ? "¡Listo! Regalo marcado como comprado y dedicatoria enviada a moderación."
                : "¡Listo! Regalo marcado como comprado.",
        };
    } catch (error) {
        console.error("markGiftAsPurchasedAction error:", error instanceof Error ? error.message : "unknown");

        return {
            success: false,
            message: "No se pudo elegir este regalo o ya no está disponible.",
        };
    }
}