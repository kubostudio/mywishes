import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Ingresa tu nombre.")
        .max(100, "El nombre no puede tener más de 100 caracteres."),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .max(255, "El email no puede exceder 255 caracteres.")
        .email("Ingresa un email válido."),
    password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres.")
        .max(128, "La contraseña no puede exceder 128 caracteres."),
    acceptTerms: z.boolean().refine((value) => value === true, {
        message: "Debes aceptar los Términos y Condiciones.",
    }),
});

export type RegisterInput = z.infer<typeof registerSchema>;