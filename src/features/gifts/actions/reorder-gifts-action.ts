"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-session";
import { reorderGifts } from "@/features/gifts/services/gift-service";

type ReorderGiftsResult = {
    success: boolean;
    message: string;
};

export async function reorderGiftsAction(
    eventId: string,
    giftIds: string[]
): Promise<ReorderGiftsResult> {
    try {
        const user = await requireUser();

        await reorderGifts(user.id, eventId, giftIds);

        revalidatePath(`/dashboard/eventos/${eventId}`);

        return {
            success: true,
            message: "Orden actualizado.",
        };
    } catch {
        return {
            success: false,
            message: "No se pudo actualizar el orden.",
        };
    }
}