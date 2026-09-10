"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth-session";
import {
    moderateMessageSchema,
    type ModerateMessageInput,
} from "@/features/messages/schemas/message-schema";
import {
    updateEventMessageStatus,
    deleteEventMessage,
} from "@/features/messages/services/message-service";
import { rateLimits } from "@/lib/rate-limit";

type ModerateResult = {
    success: boolean;
    message: string;
};

export async function moderateMessageAction(
    input: ModerateMessageInput
): Promise<ModerateResult> {
    try {
        const user = await requireUser();

        const limit = rateLimits.mutation(user.id);
        if (!limit.success) {
            return {
                success: false,
                message: "Demasiadas acciones recientes. Espera unos segundos.",
            };
        }

        const parsed = moderateMessageSchema.safeParse(input);

        if (!parsed.success) {
            return {
                success: false,
                message: "Datos de moderación inválidos.",
            };
        }

        const { eventSlug } = await updateEventMessageStatus(
            user.id,
            parsed.data.eventId,
            parsed.data.messageId,
            parsed.data.status
        );

        revalidatePath(`/dashboard/eventos/${parsed.data.eventId}`);
        revalidatePath(`/evento/${eventSlug}`);
        revalidatePath(`/evento/${eventSlug}/mensajes`);

        const actionText =
            parsed.data.status === "APPROVED" ? "aprobado" : "rechazado";

        return {
            success: true,
            message: `Mensaje ${actionText} correctamente.`,
        };
    } catch (error) {
        console.error("moderateMessageAction error:", error instanceof Error ? error.message : "unknown");

        return {
            success: false,
            message: "No se pudo actualizar el estado del mensaje.",
        };
    }
}

export async function deleteMessageAction(
    messageId: string,
    eventId: string
): Promise<ModerateResult> {
    try {
        const user = await requireUser();

        const limit = rateLimits.mutation(user.id);
        if (!limit.success) {
            return {
                success: false,
                message: "Demasiadas acciones recientes. Espera unos segundos.",
            };
        }

        const safeMessageId = typeof messageId === "string" ? messageId.trim() : "";
        const safeEventId = typeof eventId === "string" ? eventId.trim() : "";

        if (!safeMessageId || !safeEventId) {
            return {
                success: false,
                message: "Parámetros inválidos.",
            };
        }

        const { eventSlug } = await deleteEventMessage(
            user.id,
            safeEventId,
            safeMessageId
        );

        revalidatePath(`/dashboard/eventos/${safeEventId}`);
        revalidatePath(`/evento/${eventSlug}`);
        revalidatePath(`/evento/${eventSlug}/mensajes`);

        return {
            success: true,
            message: "Mensaje eliminado correctamente.",
        };
    } catch (error) {
        console.error("deleteMessageAction error:", error instanceof Error ? error.message : "unknown");

        return {
            success: false,
            message: "No se pudo eliminar el mensaje.",
        };
    }
}
