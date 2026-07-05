"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-session";
import { softDeleteGift } from "@/features/gifts/services/gift-service";

type DeleteGiftResult = {
    success: boolean;
    message: string;
};

export async function deleteGiftAction(
    giftId: string
): Promise<DeleteGiftResult> {
    try {
        const user = await requireUser();

        const gift = await softDeleteGift(user.id, giftId);

        revalidatePath(`/dashboard/eventos/${gift.eventId}`);

        return {
            success: true,
            message: "Regalo eliminado correctamente.",
        };
    } catch {
        return {
            success: false,
            message: "No se pudo eliminar el regalo.",
        };
    }
}