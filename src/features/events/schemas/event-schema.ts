import { z } from "zod";

export const eventSchema = z.object({
    type: z.enum([
        "BABY_SHOWER",
        "BIRTHDAY",
        "WEDDING",
        "BAPTISM",
        "GRADUATION",
        "CHRISTMAS",
        "OTHER",
    ]),
    name: z.string().min(2, "Ingresa el nombre del evento."),
    honoreeName: z.string().min(2, "Ingresa el nombre del homenajeado."),
    date: z.string().min(1, "Selecciona una fecha."),
    location: z.string().min(2, "Ingresa el lugar del evento."),
    locationURL: z.string().min(2, "Ingresa la ubicación en el mapa"),
    description: z.string().optional(),
});

export type EventInput = z.infer<typeof eventSchema>;