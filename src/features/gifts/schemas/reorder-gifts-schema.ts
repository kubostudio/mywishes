import { z } from "zod";

export const reorderGiftsSchema = z.object({
    eventId: z
        .string()
        .trim()
        .min(1, "El ID del evento es requerido.")
        .max(64, "ID de evento inválido."),
    giftIds: z
        .array(
            z
                .string()
                .trim()
                .min(1, "ID de regalo inválido.")
                .max(64, "ID de regalo demasiado largo.")
        )
        .min(1, "Debe indicar al menos un regalo para ordenar.")
        .max(200, "No se pueden reordenar más de 200 regalos simultáneamente.")
        .refine(
            (ids) => new Set(ids).size === ids.length,
            "La lista contiene IDs de regalo duplicados."
        ),
});

export type ReorderGiftsInput = z.infer<typeof reorderGiftsSchema>;
