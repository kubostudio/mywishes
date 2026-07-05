"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-session";
import { giftSchema, type GiftInput } from "@/features/gifts/schemas/gift-schema";
import { createGift } from "@/features/gifts/services/gift-service";

type CreateGiftResult = {
    success: boolean;
    message: string;
};

export async function createGiftAction(
    input: GiftInput
): Promise<CreateGiftResult> {
    try {
        const user = await requireUser();

        const parsed = giftSchema.safeParse(input);

        if (!parsed.success) {
            return {
                success: false,
                message: "Revisa los datos del regalo.",
            };
        }

        await createGift(user.id, parsed.data);

        revalidatePath(`/dashboard/eventos/${parsed.data.eventId}`);

        return {
            success: true,
            message: "Regalo agregado correctamente.",
        };
    } catch {
        return {
            success: false,
            message: "No se pudo agregar el regalo.",
        };
    }
}