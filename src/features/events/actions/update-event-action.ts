"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-session";
import {
    eventSchema,
    type EventInput,
} from "@/features/events/schemas/event-schema";
import { updateEvent } from "@/features/events/services/event-service";

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

        const parsed = eventSchema.safeParse(input);

        if (!parsed.success) {
            return {
                success: false,
                message: "Revisa los datos del evento.",
            };
        }

        await updateEvent(user.id, eventId, parsed.data);

        revalidatePath("/dashboard");
        revalidatePath(`/dashboard/eventos/${eventId}`);

        return {
            success: true,
            message: "Evento actualizado correctamente.",
        };
    } catch {
        return {
            success: false,
            message: "No se pudo actualizar el evento.",
        };
    }
}