"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-session";
import { softDeleteEvent } from "@/features/events/services/event-service";
import { rateLimits } from "@/lib/rate-limit";

type DeleteEventResult = {
    success: boolean;
    message: string;
};

export async function deleteEventAction(
    eventId: string
): Promise<DeleteEventResult> {
    try {
        const user = await requireUser();

        const limit = rateLimits.mutation(user.id);
        if (!limit.success) {
            return {
                success: false,
                message: "Has realizado muchas acciones recientemente. Espera unos segundos.",
            };
        }

        const safeEventId = typeof eventId === "string" ? eventId.trim() : "";
        if (!safeEventId || safeEventId.length > 64) {
            return {
                success: false,
                message: "Identificador de evento inválido.",
            };
        }

        await softDeleteEvent(user.id, safeEventId);

        revalidatePath("/dashboard");

        return {
            success: true,
            message: "Evento eliminado correctamente.",
        };
    } catch (error) {
        console.error("deleteEventAction error:", error instanceof Error ? error.message : "unknown");

        return {
            success: false,
            message: "No se pudo eliminar el evento.",
        };
    }
}