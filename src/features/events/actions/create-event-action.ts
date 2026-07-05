"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-session";
import {
    eventSchema,
    type EventInput,
} from "@/features/events/schemas/event-schema";
import { createEvent } from "@/features/events/services/event-service";

type CreateEventResult = {
    success: boolean;
    message: string;
};

export async function createEventAction(
    input: EventInput
): Promise<CreateEventResult> {
    try {
        const user = await requireUser();

        const parsed = eventSchema.safeParse(input);

        if (!parsed.success) {
            return {
                success: false,
                message: "Revisa los datos del evento.",
            };
        }

        await createEvent(user.id, parsed.data);

        revalidatePath("/dashboard");

        return {
            success: true,
            message: "Evento creado correctamente.",
        };
    } catch {
        return {
            success: false,
            message: "Debes iniciar sesión.",
        };
    }
}