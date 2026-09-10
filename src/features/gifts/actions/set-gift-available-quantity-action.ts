"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-session";
import { setGiftAvailableQuantity } from "@/features/gifts/services/gift-service";
import { rateLimits } from "@/lib/rate-limit";

type SetGiftAvailableQuantityResult = {
    success: boolean;
    message: string;
};

export async function setGiftAvailableQuantityAction(
    giftId: string,
    eventId: string,
    availableQuantity: number
): Promise<SetGiftAvailableQuantityResult> {
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

        if (
            typeof availableQuantity !== "number" ||
            !Number.isInteger(availableQuantity) ||
            availableQuantity < 1 ||
            availableQuantity > 9999
        ) {
            return {
                success: false,
                message: "Cantidad disponible no válida.",
            };
        }

        await setGiftAvailableQuantity(
            user.id,
            safeGiftId,
            availableQuantity
        );

        revalidatePath(`/dashboard/eventos/${safeEventId}`);

        return {
            success: true,
            message: "Disponibilidad actualizada correctamente.",
        };
    } catch (error) {
        console.error("setGiftAvailableQuantityAction error:", error instanceof Error ? error.message : "unknown");

        return {
            success: false,
            message: "No se pudo actualizar la disponibilidad.",
        };
    }
}