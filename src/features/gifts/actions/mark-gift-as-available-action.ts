"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-session";
import { markGiftAsAvailable } from "@/features/gifts/services/gift-service";

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

        await markGiftAsAvailable(user.id, giftId);

        revalidatePath(`/dashboard/eventos/${eventId}`);

        return {
            success: true,
            message: "El regalo vuelve a estar disponible.",
        };
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "No se pudo actualizar el regalo.",
        };
    }
}