"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-session";
import { giftSchema, type GiftInput } from "@/features/gifts/schemas/gift-schema";
import { updateGift } from "@/features/gifts/services/gift-service";

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

        const parsed = giftSchema.safeParse(input);

        if (!parsed.success) {
            return {
                success: false,
                message: "Revisa los datos del regalo.",
            };
        }

        await updateGift(user.id, giftId, parsed.data);

        revalidatePath(`/dashboard/eventos/${parsed.data.eventId}`);

        return {
            success: true,
            message: "Regalo actualizado correctamente.",
        };
    } catch {
        return {
            success: false,
            message: "No se pudo actualizar el regalo.",
        };
    }
}