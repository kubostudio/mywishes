"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-session";
import { giftSchema, type GiftInput } from "@/features/gifts/schemas/gift-schema";
import { updateGift } from "@/features/gifts/services/gift-service";
import { rateLimits } from "@/lib/rate-limit";

type UpdateGiftResult = {
    success: boolean;
    message: string;
};

export async function updateGiftAction(
    giftId: string,
    input: GiftInput
): Promise<UpdateGiftResult> {
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

        const parsed = giftSchema.safeParse(input);

        if (!parsed.success) {
            const firstError = parsed.error.issues[0]?.message || "Revisa los datos del regalo.";
            return {
                success: false,
                message: firstError,
            };
        }

        await updateGift(user.id, safeGiftId, parsed.data);

        revalidatePath(`/dashboard/eventos/${parsed.data.eventId}`);

        return {
            success: true,
            message: "Regalo actualizado correctamente.",
        };
    } catch (error) {
        console.error("updateGiftAction error:", error instanceof Error ? error.message : "unknown");

        return {
            success: false,
            message: "No se pudo actualizar el regalo.",
        };
    }
}