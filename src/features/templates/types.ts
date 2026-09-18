import type { EventType } from "@prisma/client";

export type TemplateId =
    | "storybook"
    | "baby_pastel"
    | "wedding_gold"
    | "baptism_sky"
    | "christmas_magic"
    | "custom";

export type TemplateCategory = "free" | "event_specific" | "premium" | "custom";

export type TemplatePalette = {
    primary: string;
    secondary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    accent: string;
};

export type TemplateDecorStyle =
    | "forest"
    | "sparkles"
    | "bubbles"
    | "snow"
    | "none";

export type CustomThemeConfig = {
    background: string;
    card: string;
    cardSubtle: string;
    border: string;
    textTitle: string;
    textBody: string;
    accent: string;
    accentText: string;
    decorStyle: TemplateDecorStyle;
};

export type TemplateDefinition = {
    id: TemplateId;
    name: string;
    tagline: string;
    description: string;
    isFree: boolean;
    price: number; // In PEN (Soles)
    category: TemplateCategory;
    eventType?: EventType | "ALL";
    badgeText?: string;
    palette: TemplatePalette;
    previewColors: string[];
    decorStyle: TemplateDecorStyle;
};

export type BankPaymentInfo = {
    yape: {
        phone: string;
        holderName: string;
        qrImageUrl?: string;
    };
    plin: {
        phone: string;
        holderName: string;
        qrImageUrl?: string;
    };
};
