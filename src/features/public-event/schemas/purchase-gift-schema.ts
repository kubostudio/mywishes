import { z } from "zod";

export const purchaseGiftSchema = z.object({
    giftId: z
        .string()
        .trim()
        .min(1, "ID de regalo requerido.")
        .max(64, "ID de regalo inválido."),
    eventSlug: z
        .string()
        .trim()
        .min(1, "Slug del evento requerido.")
        .max(200, "Slug de evento inválido."),
    quantityToPurchase: z
        .number()
        .int("La cantidad debe ser un número entero.")
        .min(1, "La cantidad debe ser al menos 1.")
        .max(100, "No se puede seleccionar más de 100 unidades."),
    guestName: z
        .string()
        .trim()
        .max(100, "El nombre no puede exceder 100 caracteres.")
        .optional(),
    guestMessage: z
        .string()
        .trim()
        .max(1000, "La dedicatoria no puede exceder 1,000 caracteres.")
        .optional(),
    showGiftInDedication: z
        .boolean()
        .default(true)
        .optional(),
});

export type PurchaseGiftInput = z.infer<typeof purchaseGiftSchema>;
