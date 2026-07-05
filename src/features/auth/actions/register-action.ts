"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import {
    registerSchema,
    type RegisterInput,
} from "@/features/auth/schemas/register-schema";

type RegisterResult = {
    success: boolean;
    message: string;
};

export async function registerAction(
    input: RegisterInput
): Promise<RegisterResult> {
    const parsed = registerSchema.safeParse(input);

    if (!parsed.success) {
        return {
            success: false,
            message: "Revisa los datos ingresados.",
        };
    }

    const email = parsed.data.email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return {
            success: false,
            message: "Ya existe una cuenta con este email.",
        };
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);

    await prisma.user.create({
        data: {
            name: parsed.data.name,
            email,
            passwordHash,
        },
    });

    return {
        success: true,
        message: "Cuenta creada correctamente.",
    };
}