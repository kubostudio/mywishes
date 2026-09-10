"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-session";
import {
    eventSchema,
    type EventInput,
} from "@/features/events/schemas/event-schema";
import { createEvent } from "@/features/events/services/event-service";
import { rateLimits } from "@/lib/rate-limit";

type CreateEventResult = {
    success: boolean;
    message: string;
};

export async function createEventAction(
    input: EventInput
): Promise<CreateEventResult> {
    try {
        const user = await requireUser();

        // Rate limit mutations per user
        const limit = rateLimits.mutation(user.id);
        if (!limit.success) {
            return {
                success: false,
                message: "Has realizado muchas acciones recientemente. Espera unos segundos.",
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

        await createEvent(user.id, parsed.data);

        revalidatePath("/dashboard");

        return {
            success: true,
            message: "Evento creado correctamente.",
        };
    } catch (error) {
        console.error("createEventAction error:", error instanceof Error ? error.message : "unknown");

        return {
            success: false,
            message: "No se pudo crear el evento. Intenta nuevamente.",
        };
    }
}