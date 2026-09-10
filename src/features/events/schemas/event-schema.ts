import { z } from "zod";
import { sanitizeUrl } from "@/lib/sanitization";

const eventBaseSchema = z.object({
    type: z.enum([
        "BABY_SHOWER",
        "BIRTHDAY",
        "WEDDING",
        "BAPTISM",
        "GENDER_REVEAL",
        "CHRISTMAS",
        "OTHER",
    ]),

    name: z
        .string()
        .trim()
        .min(2, "Ingresa el nombre del evento.")
        .max(150, "El nombre del evento no puede exceder 150 caracteres."),

    honoreeName: z
        .string()
        .trim()
        .max(100, "El nombre del homenajeado no puede exceder 100 caracteres.")
        .optional(),

    gender: z.enum(["MALE", "FEMALE"]).optional(),

    birthdayAge: z
        .number()
        .int()
        .min(1, "La edad debe ser al menos 1.")
        .max(130, "Ingresa una edad válida.")
        .optional(),

    dressCode: z
        .string()
        .trim()
        .max(100, "El código de vestimenta no puede exceder 100 caracteres.")
        .optional(),

    location: z
        .string()
        .trim()
        .min(2, "Ingresa el lugar del evento.")
        .max(255, "El lugar del evento no puede exceder 255 caracteres."),

    locationURL: z
        .string()
        .trim()
        .min(2, "Ingresa la ubicación en el mapa.")
        .max(2048, "El link del mapa no puede exceder 2048 caracteres.")
        .refine((value) => sanitizeUrl(value) !== null, {
            message: "Ingresa un link de mapa válido (https://...).",
        }),

    description: z
        .string()
        .trim()
        .max(2000, "La descripción no puede exceder 2000 caracteres.")
        .optional(),
});

function validateEventRules(
    data: {
        type: string;
        honoreeName?: string;
        gender?: "MALE" | "FEMALE";
        birthdayAge?: number;
        date: string;
        endDate?: string;
    },
    ctx: z.RefinementCtx
) {
    if (
        data.type !== "GENDER_REVEAL" &&
        data.type !== "CHRISTMAS" &&
        (!data.honoreeName || data.honoreeName.trim().length < 2)
    ) {
        ctx.addIssue({
            code: "custom",
            path: ["honoreeName"],
            message: "Ingresa el nombre del homenajeado.",
        });
    }

    if (
        data.type !== "GENDER_REVEAL" &&
        data.type !== "CHRISTMAS" &&
        !data.gender
    ) {
        ctx.addIssue({
            code: "custom",
            path: ["gender"],
            message: "Selecciona el género.",
        });
    }

    if (data.type === "BIRTHDAY" && !data.birthdayAge) {
        ctx.addIssue({
            code: "custom",
            path: ["birthdayAge"],
            message: "Ingresa cuántos años cumple.",
        });
    }

    if (data.endDate) {
        const start = new Date(data.date);
        const end = new Date(data.endDate);

        if (end <= start) {
            ctx.addIssue({
                code: "custom",
                path: ["endDate"],
                message: "La hora de fin debe ser posterior a la hora de inicio.",
            });
        }
    }
}

export const eventFormSchema = eventBaseSchema
    .extend({
        date: z.string().min(1, "Selecciona fecha y hora de inicio."),
        endDate: z.string().optional(),
    })
    .superRefine(validateEventRules);

export type EventFormInput = z.infer<typeof eventFormSchema>;

export const eventSchema = eventBaseSchema
    .extend({
        date: z.string().datetime("La fecha y hora de inicio no es válida."),

        endDate: z
            .string()
            .datetime("La fecha y hora de fin no es válida.")
            .optional(),

        timezone: z
            .string()
            .trim()
            .min(1, "No se pudo detectar la zona horaria.")
            .max(100, "Zona horaria inválida."),
    })
    .superRefine(validateEventRules);

export type EventInput = z.infer<typeof eventSchema>;