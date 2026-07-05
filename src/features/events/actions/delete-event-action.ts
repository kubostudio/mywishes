"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-session";
import { softDeleteEvent } from "@/features/events/services/event-service";

type DeleteEventResult = {
    success: boolean;
    message: string;
};

export async function deleteEventAction(
    eventId: string
): Promise<DeleteEventResult> {
    try {
        const user = await requireUser();

        await softDeleteEvent(user.id, eventId);

        revalidatePath("/dashboard");

        return {
            success: true,
            message: "Evento eliminado correctamente.",
        };
    } catch {
        return {
            success: false,
            message: "No se pudo eliminar el evento.",
        };
    }
}