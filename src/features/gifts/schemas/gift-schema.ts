import { z } from "zod";

const optionalUrl = z
    .string()
    .trim()
    .refine((value) => value === "" || z.url().safeParse(value).success, {
        message: "Ingresa una URL válida.",
    })
    .optional();

export const giftSchema = z.object({
    eventId: z.string().min(1),
    name: z.string().min(2, "Ingresa el nombre del regalo."),
    quantity: z.number().int().min(1, "La cantidad debe ser al menos 1."),
    imageUrl: optionalUrl,
    brand: z.string().optional(),
    price: z.string().optional(),
    currency: z.string().min(3).max(3),
    description: z.string().optional(),
    color: z.string().optional(),
    size: z.string().optional(),
    dimensions: z.string().optional(),
    originalUrl: optionalUrl,
});

export type GiftInput = z.infer<typeof giftSchema>;
export type GiftData = z.infer<typeof giftSchema>;