import { z } from "zod";

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

    name: z.string().min(2, "Ingresa el nombre del evento."),
    honoreeName: z.string().optional(),

    gender: z.enum(["MALE", "FEMALE"]).optional(),

    birthdayAge: z
        .number()
        .int()
        .positive("Ingresa una edad válida.")
        .optional(),

    dressCode: z.string().optional(),

    location: z.string().min(2, "Ingresa el lugar del evento."),
    locationURL: z.string().min(2, "Ingresa la ubicación en el mapa"),
    description: z.string().optional(),
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
            .min(1, "No se pudo detectar la zona horaria."),
    })
    .superRefine(validateEventRules);

export type EventInput = z.infer<typeof eventSchema>;