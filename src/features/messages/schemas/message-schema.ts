import { z } from "zod";

export const createMessageSchema = z.object({
    eventId: z
        .string()
        .trim()
        .min(1, "El ID del evento es requerido.")
        .max(64, "ID de evento inválido."),
    authorName: z
        .string()
        .trim()
        .max(100, "El nombre no puede exceder 100 caracteres.")
        .optional(),
    content: z
        .string()
        .trim()
        .min(2, "Por favor escribe tu dedicatoria.")
        .max(1000, "La dedicatoria no puede exceder 1,000 caracteres."),
    giftId: z
        .string()
        .trim()
        .max(64, "ID de regalo inválido.")
        .optional()
        .nullable(),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;

export const moderateMessageSchema = z.object({
    messageId: z
        .string()
        .trim()
        .min(1, "ID de mensaje requerido.")
        .max(64, "ID de mensaje inválido."),
    eventId: z
        .string()
        .trim()
        .min(1, "ID de evento requerido.")
        .max(64, "ID de evento inválido."),
    status: z.enum(["APPROVED", "REJECTED"]),
});

export type ModerateMessageInput = z.infer<typeof moderateMessageSchema>;
