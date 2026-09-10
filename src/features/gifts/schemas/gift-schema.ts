import { z } from "zod";
import { sanitizeUrl } from "@/lib/sanitization";

const optionalSafeUrl = z
    .string()
    .trim()
    .max(2048, "La URL no puede exceder 2048 caracteres.")
    .refine(
        (value) => {
            if (!value || value === "") return true;
            return sanitizeUrl(value) !== null;
        },
        {
            message: "Ingresa un enlace válido que inicie con http:// o https://.",
        }
    )
    .optional();

const priceRegex = /^\d{1,8}(\.\d{1,2})?$/;

export const giftSchema = z.object({
    eventId: z
        .string()
        .trim()
        .min(1, "El ID del evento es requerido.")
        .max(64, "ID de evento inválido."),

    name: z
        .string()
        .trim()
        .min(2, "Ingresa el nombre del regalo.")
        .max(150, "El nombre del regalo no puede exceder 150 caracteres."),

    quantity: z
        .number()
        .int("La cantidad debe ser un número entero.")
        .min(1, "La cantidad debe ser al menos 1.")
        .max(9999, "La cantidad máxima es 9,999."),

    imageUrl: optionalSafeUrl,

    brand: z
        .string()
        .trim()
        .max(100, "La marca no puede exceder 100 caracteres.")
        .optional(),

    price: z
        .string()
        .trim()
        .max(20, "Precio inválido.")
        .refine(
            (val) => !val || val === "" || priceRegex.test(val),
            {
                message: "Ingresa un precio numérico válido (ej. 49.90).",
            }
        )
        .optional(),

    currency: z
        .string()
        .trim()
        .toUpperCase()
        .regex(/^[A-Z]{3}$/, "Moneda inválida (código ISO de 3 letras)."),

    description: z
        .string()
        .trim()
        .max(2000, "La descripción no puede exceder 2000 caracteres.")
        .optional(),

    color: z
        .string()
        .trim()
        .max(50, "El color no puede exceder 50 caracteres.")
        .optional(),

    size: z
        .string()
        .trim()
        .max(50, "La talla no puede exceder 50 caracteres.")
        .optional(),

    dimensions: z
        .string()
        .trim()
        .max(50, "Las medidas no pueden exceder 50 caracteres.")
        .optional(),

    originalUrl: optionalSafeUrl,
});

export type GiftInput = z.infer<typeof giftSchema>;
export type GiftData = z.infer<typeof giftSchema>;