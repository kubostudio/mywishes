"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import {
    registerSchema,
    type RegisterInput,
} from "@/features/auth/schemas/register-schema";
import { getClientIp, rateLimits } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/sanitization";

type RegisterResult = {
    success: boolean;
    message: string;
};

export async function registerAction(
    input: RegisterInput
): Promise<RegisterResult> {
    try {
        // 1. Rate Limiting: max 5 registrations per hour per IP
        const clientIp = await getClientIp();
        const ipLimit = rateLimits.register(clientIp);

        if (!ipLimit.success) {
            const minutesLeft = Math.ceil(ipLimit.retryAfterSeconds / 60);
            return {
                success: false,
                message: `Demasiados intentos de registro desde esta red. Por favor intenta de nuevo en ${minutesLeft} minutos.`,
            };
        }

        // 2. Strict Zod schema validation
        const parsed = registerSchema.safeParse(input);

        if (!parsed.success) {
            return {
                success: false,
                message: "Por favor revisa los datos ingresados.",
            };
        }

        const email = parsed.data.email.trim().toLowerCase();
        const sanitizedName = sanitizeText(parsed.data.name, 100);

        if (!sanitizedName || sanitizedName.length < 2) {
            return {
                success: false,
                message: "El nombre ingresado no es válido.",
            };
        }

        // 3. Check for existing user
        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });

        if (existingUser) {
            return {
                success: false,
                message: "Ya existe una cuenta registrada con este email.",
            };
        }

        // 4. Secure password hashing with cost factor 12
        const passwordHash = await bcrypt.hash(parsed.data.password, 12);

        await prisma.user.create({
            data: {
                name: sanitizedName,
                email,
                passwordHash,
            },
        });

        return {
            success: true,
            message: "Cuenta creada correctamente. Ya puedes iniciar sesión.",
        };
    } catch (error) {
        console.error("registerAction secure error:", error instanceof Error ? error.message : "unknown");

        return {
            success: false,
            message: "Ocurrió un error al procesar tu solicitud. Intenta nuevamente.",
        };
    }
}