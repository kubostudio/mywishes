"use server";

import { revalidatePath } from "next/cache";

import {
    createMessageSchema,
    type CreateMessageInput,
} from "@/features/messages/schemas/message-schema";
import { createEventMessage } from "@/features/messages/services/message-service";
import { getClientIp, rateLimits } from "@/lib/rate-limit";

type CreateMessageResult = {
    success: boolean;
    message: string;
};

export async function createMessageAction(
    input: CreateMessageInput,
    eventSlug?: string
): Promise<CreateMessageResult> {
    try {
        // 1. Rate limiting by IP: max 10 messages per minute per IP
        const clientIp = await getClientIp();
        const ipLimit = rateLimits.publicMessage(clientIp);

        if (!ipLimit.success) {
            return {
                success: false,
                message: "Has enviado varios mensajes recientemente. Por favor espera un momento.",
            };
        }

        // 2. Strict Zod validation
        const parsed = createMessageSchema.safeParse(input);

        if (!parsed.success) {
            const firstError = parsed.error.issues[0]?.message || "Por favor revisa el mensaje ingresado.";
            return {
                success: false,
                message: firstError,
            };
        }

        await createEventMessage({
            eventId: parsed.data.eventId,
            authorName: parsed.data.authorName,
            content: parsed.data.content,
        });

        if (eventSlug) {
            revalidatePath(`/evento/${eventSlug}`);
            revalidatePath(`/evento/${eventSlug}/mensajes`);
        }
        revalidatePath(`/dashboard/eventos/${parsed.data.eventId}`);

        return {
            success: true,
            message: "¡Muchas gracias! Tu dedicatoria ha sido enviada y se publicará tan pronto sea aprobada.",
        };
    } catch (error) {
        console.error("createMessageAction error:", error instanceof Error ? error.message : "unknown");

        return {
            success: false,
            message: "No se pudo enviar la dedicatoria en este momento. Intenta nuevamente.",
        };
    }
}
