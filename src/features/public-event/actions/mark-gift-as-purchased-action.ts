"use server";

import { revalidatePath } from "next/cache";

import { markGiftAsPurchased } from "@/features/gifts/services/gift-service";

type MarkGiftResult = {
    success: boolean;
    message: string;
};

export async function markGiftAsPurchasedAction(
    giftId: string,
    eventSlug: string,
    quantityToPurchase = 1
): Promise<MarkGiftResult> {
    try {
        await markGiftAsPurchased(giftId, quantityToPurchase);

        revalidatePath(`/evento/${eventSlug}`);

        return {
            success: true,
            message: "Regalo marcado como comprado.",
        };
    } catch {
        return {
            success: false,
            message: "No se pudo elegir este regalo.",
        };
    }
}