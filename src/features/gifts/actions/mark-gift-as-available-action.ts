"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-session";
import { markGiftAsAvailable } from "@/features/gifts/services/gift-service";
import { rateLimits } from "@/lib/rate-limit";

type MarkGiftAsAvailableResult = {
    success: boolean;
    message: string;
};

export async function markGiftAsAvailableAction(
    giftId: string,
    eventId: string
): Promise<MarkGiftAsAvailableResult> {
    try {
        const user = await requireUser();

        const limit = rateLimits.mutation(user.id);
        if (!limit.success) {
            return {
                success: false,
                message: "Has realizado muchas acciones recientemente. Espera unos segundos.",
            };
        }

        const safeGiftId = typeof giftId === "string" ? giftId.trim() : "";
        const safeEventId = typeof eventId === "string" ? eventId.trim() : "";

        if (!safeGiftId || safeGiftId.length > 64 || !safeEventId || safeEventId.length > 64) {
            return {
                success: false,
                message: "Parámetros inválidos.",
            };
        }

        await markGiftAsAvailable(user.id, safeGiftId);

        revalidatePath(`/dashboard/eventos/${safeEventId}`);

        return {
            success: true,
            message: "El regalo vuelve a estar disponible.",
        };
    } catch (error) {
        console.error("markGiftAsAvailableAction error:", error instanceof Error ? error.message : "unknown");

        return {
            success: false,
            message: "No se pudo actualizar la disponibilidad del regalo.",
        };
    }
}