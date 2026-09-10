"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-session";
import { giftSchema, type GiftInput } from "@/features/gifts/schemas/gift-schema";
import { createGift } from "@/features/gifts/services/gift-service";
import { rateLimits } from "@/lib/rate-limit";

type CreateGiftResult = {
    success: boolean;
    message: string;
};

export async function createGiftAction(
    input: GiftInput
): Promise<CreateGiftResult> {
    try {
        const user = await requireUser();

        const limit = rateLimits.mutation(user.id);
        if (!limit.success) {
            return {
                success: false,
                message: "Has realizado muchas acciones recientemente. Espera unos segundos.",
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

        await createGift(user.id, parsed.data);

        revalidatePath(`/dashboard/eventos/${parsed.data.eventId}`);

        return {
            success: true,
            message: "Regalo agregado correctamente.",
        };
    } catch (error) {
        console.error("createGiftAction error:", error instanceof Error ? error.message : "unknown");

        return {
            success: false,
            message: "No se pudo agregar el regalo. Intenta nuevamente.",
        };
    }
}