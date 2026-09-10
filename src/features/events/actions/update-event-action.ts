"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-session";
import {
    eventSchema,
    type EventInput,
} from "@/features/events/schemas/event-schema";
import { updateEvent } from "@/features/events/services/event-service";
import { rateLimits } from "@/lib/rate-limit";

type UpdateEventResult = {
    success: boolean;
    message: string;
};

export async function updateEventAction(
    eventId: string,
    input: EventInput
): Promise<UpdateEventResult> {
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

        const parsed = eventSchema.safeParse(input);

        if (!parsed.success) {
            const firstError = parsed.error.issues[0]?.message || "Revisa los datos del evento.";
            return {
                success: false,
                message: firstError,
            };
        }

        await updateEvent(user.id, safeEventId, parsed.data);

        revalidatePath("/dashboard");
        revalidatePath(`/dashboard/eventos/${safeEventId}`);

        return {
            success: true,
            message: "Evento actualizado correctamente.",
        };
    } catch (error) {
        console.error("updateEventAction error:", error instanceof Error ? error.message : "unknown");

        return {
            success: false,
            message: "No se pudo actualizar el evento.",
        };
    }
}