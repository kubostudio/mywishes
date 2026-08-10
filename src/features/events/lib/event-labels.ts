import type { EventType } from "@prisma/client";

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
    BABY_SHOWER: "Baby Shower",
    BIRTHDAY: "Cumpleaños",
    WEDDING: "Matrimonio",
    BAPTISM: "Bautizo",
    GENDER_REVEAL: "Gender Reveal",
    CHRISTMAS: "Navidad",
    OTHER: "Otro",
};