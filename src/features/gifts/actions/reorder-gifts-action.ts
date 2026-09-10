"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-session";
import { reorderGifts } from "@/features/gifts/services/gift-service";
import { reorderGiftsSchema } from "@/features/gifts/schemas/reorder-gifts-schema";
import { rateLimits } from "@/lib/rate-limit";

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

        const limit = rateLimits.mutation(user.id);
        if (!limit.success) {
            return {
                success: false,
                message: "Has realizado muchas acciones recientemente. Espera unos segundos.",
            };
        }

        const parsed = reorderGiftsSchema.safeParse({
            eventId,
            giftIds,
        });

        if (!parsed.success) {
            return {
                success: false,
                message: parsed.error.issues[0]?.message || "Datos de ordenamiento inválidos.",
            };
        }

        await reorderGifts(user.id, parsed.data.eventId, parsed.data.giftIds);

        revalidatePath(`/dashboard/eventos/${parsed.data.eventId}`);

        return {
            success: true,
            message: "Orden actualizado.",
        };
    } catch (error) {
        console.error("reorderGiftsAction error:", error instanceof Error ? error.message : "unknown");

        return {
            success: false,
            message: "No se pudo actualizar el orden.",
        };
    }
}