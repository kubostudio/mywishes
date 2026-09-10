"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-session";
import { softDeleteGift } from "@/features/gifts/services/gift-service";
import { rateLimits } from "@/lib/rate-limit";

type DeleteGiftResult = {
    success: boolean;
    message: string;
};

export async function deleteGiftAction(
    giftId: string
): Promise<DeleteGiftResult> {
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
        if (!safeGiftId || safeGiftId.length > 64) {
            return {
                success: false,
                message: "Identificador de regalo inválido.",
            };
        }

        const gift = await softDeleteGift(user.id, safeGiftId);

        revalidatePath(`/dashboard/eventos/${gift.eventId}`);

        return {
            success: true,
            message: "Regalo eliminado correctamente.",
        };
    } catch (error) {
        console.error("deleteGiftAction error:", error instanceof Error ? error.message : "unknown");

        return {
            success: false,
            message: "No se pudo eliminar el regalo.",
        };
    }
}