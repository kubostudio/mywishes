"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-session";
import { setGiftAvailableQuantity } from "@/features/gifts/services/gift-service";

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

        await setGiftAvailableQuantity(
            user.id,
            giftId,
            availableQuantity
        );

        revalidatePath(`/dashboard/eventos/${eventId}`);

        return {
            success: true,
            message: "Disponibilidad actualizada correctamente.",
        };
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "No se pudo actualizar la disponibilidad.",
        };
    }
}