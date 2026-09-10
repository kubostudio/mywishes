import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .max(255, "El email no puede exceder 255 caracteres.")
        .email("Ingresa un email válido."),
    password: z
        .string()
        .min(1, "Ingresa tu contraseña.")
        .max(128, "La contraseña no puede exceder 128 caracteres."),
});

export type LoginInput = z.infer<typeof loginSchema>;