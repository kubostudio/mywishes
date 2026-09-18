import type { EventType } from "@prisma/client";
import type {
    BankPaymentInfo,
    CustomThemeConfig,
    TemplateDefinition,
    TemplateId,
} from "../types";

export const FREE_TEMPLATE_IDS: TemplateId[] = [
    "storybook",
    "baby_pastel",
    "wedding_gold",
    "baptism_sky",
    "christmas_magic",
    "custom",
];

export const DEFAULT_TEMPLATE_ID: TemplateId = "storybook";

export const DEFAULT_CUSTOM_THEME: CustomThemeConfig = {
    background: "linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)",
    card: "#FFFFFF",
    cardSubtle: "#F1F5F9",
    border: "#CBD5E1",
    textTitle: "#0F172A",
    textBody: "#334155",
    accent: "#0EA5E9",
    accentText: "#FFFFFF",
    decorStyle: "sparkles",
};

export const CUSTOM_THEME_PRESETS: { name: string; config: CustomThemeConfig }[] = [
    {
        name: "Modo Oscuro Grafito",
        config: {
            background: "linear-gradient(180deg, #090D16 0%, #0F172A 100%)",
            card: "#131C2E",
            cardSubtle: "#1E293B",
            border: "#334155",
            textTitle: "#F8FAFC",
            textBody: "#CBD5E1",
            accent: "#38BDF8",
            accentText: "#0F172A",
            decorStyle: "sparkles",
        },
    },
    {
        name: "Lavanda Romántica",
        config: {
            background: "linear-gradient(180deg, #FAF5FF 0%, #F3E8FF 100%)",
            card: "#FFFFFF",
            cardSubtle: "#FAF5FF",
            border: "#E9D5FF",
            textTitle: "#581C87",
            textBody: "#7E22CE",
            accent: "#A855F7",
            accentText: "#FFFFFF",
            decorStyle: "bubbles",
        },
    },
    {
        name: "Menta & Esmeralda",
        config: {
            background: "linear-gradient(180deg, #F0FDF4 0%, #DCFCE7 100%)",
            card: "#FFFFFF",
            cardSubtle: "#F0FDF4",
            border: "#BBF7D0",
            textTitle: "#14532D",
            textBody: "#166534",
            accent: "#22C55E",
            accentText: "#FFFFFF",
            decorStyle: "forest",
        },
    },
    {
        name: "Rosa Pastel Suave",
        config: {
            background: "linear-gradient(180deg, #FFF1F2 0%, #FFE4E6 100%)",
            card: "#FFFFFF",
            cardSubtle: "#FFF1F2",
            border: "#FECDD3",
            textTitle: "#881337",
            textBody: "#9F1239",
            accent: "#F43F5E",
            accentText: "#FFFFFF",
            decorStyle: "bubbles",
        },
    },
    {
        name: "Blanco Puro & Champagne",
        config: {
            background: "linear-gradient(180deg, #FDFBF7 0%, #F5EFE6 100%)",
            card: "#FFFFFF",
            cardSubtle: "#FAF6ED",
            border: "#E7DCB9",
            textTitle: "#292524",
            textBody: "#44403C",
            accent: "#D4AF37",
            accentText: "#FFFFFF",
            decorStyle: "sparkles",
        },
    },
];

export const DEFAULT_BANK_PAYMENT_INFO: BankPaymentInfo = {
    yape: {
        phone: "987 654 321",
        holderName: "MyWishes Perú / Kubo Studio",
    },
    plin: {
        phone: "987 654 321",
        holderName: "MyWishes Perú / Kubo Studio",
    },
};

export const TEMPLATE_CATALOG: TemplateDefinition[] = [
    {
        id: "storybook",
        name: "Miel del Bosque",
        tagline: "Artesanal, cálido e ilustrado",
        description:
            "El estilo insignia de MyWishes: tonos miel dorado, crema suave, madera cálida y detalles botánicos del bosque.",
        isFree: true,
        price: 0,
        category: "free",
        eventType: "ALL",
        badgeText: "Gratis • Clásica",
        previewColors: ["#FFF8E8", "#F8C63D", "#3E260E", "#FFEFC4"],
        palette: {
            primary: "#F8C63D",
            secondary: "#FFF8E7",
            background: "linear-gradient(180deg, #FFF8E8 0%, #FFEFC4 100%)",
            card: "#FFFDF7",
            text: "#3E260E",
            border: "#E8C78A",
            accent: "#B97A22",
        },
        decorStyle: "forest",
    },
    {
        id: "baby_pastel",
        name: "Nube Pastel",
        tagline: "Ternura y ensueño para Baby Shower",
        description:
            "Rosa algodón, celeste cielo y lavanda suave con texturas acolchadas y nubes flotantes para celebrar la llegada del bebé.",
        isFree: true,
        price: 0,
        category: "free",
        eventType: "BABY_SHOWER",
        badgeText: "Gratis • Baby Shower",
        previewColors: ["#FFF0F5", "#FDE2E4", "#BEE1E6", "#725175"],
        palette: {
            primary: "#F4978E",
            secondary: "#FDF0ED",
            background: "linear-gradient(180deg, #FFF5F7 0%, #F0F7FF 100%)",
            card: "#FFFFFF",
            text: "#523B59",
            border: "#F7CAD0",
            accent: "#F4978E",
        },
        decorStyle: "bubbles",
    },
    {
        id: "wedding_gold",
        name: "Elegancia Champagne",
        tagline: "Lujo romántico para Bodas",
        description:
            "Champagne marfil, oro metálico cepillado y blanco seda para listas de bodas con máxima distinción.",
        isFree: true,
        price: 0,
        category: "free",
        eventType: "WEDDING",
        badgeText: "Gratis • Boda",
        previewColors: ["#FAF8F5", "#D4AF37", "#2C2A29", "#F3EFE6"],
        palette: {
            primary: "#D4AF37",
            secondary: "#FAF6ED",
            background: "linear-gradient(180deg, #FDFBF7 0%, #F4ECE1 100%)",
            card: "#FFFFFF",
            text: "#2C2A29",
            border: "#E5D4B7",
            accent: "#C29B27",
        },
        decorStyle: "sparkles",
    },
    {
        id: "baptism_sky",
        name: "Pureza Celestial",
        tagline: "Serenidad para Bautizos",
        description:
            "Blanco perlado, celeste etéreo y suaves destellos dorados para un ambiente pacífico y solemne.",
        isFree: true,
        price: 0,
        category: "free",
        eventType: "BAPTISM",
        badgeText: "Gratis • Bautizo",
        previewColors: ["#F0F9FF", "#E0F2FE", "#BAE6FD", "#0369A1"],
        palette: {
            primary: "#0284C7",
            secondary: "#F0F9FF",
            background: "linear-gradient(180deg, #F8FAFC 0%, #E0F2FE 100%)",
            card: "#FFFFFF",
            text: "#0C4A6E",
            border: "#BAE6FD",
            accent: "#0369A1",
        },
        decorStyle: "bubbles",
    },
    {
        id: "christmas_magic",
        name: "Noche Buena Mágica",
        tagline: "Calidez navideña y festiva",
        description:
            "Verde pino noble, rojo carmesí aterciopelado y nieve dorada para listas de deseos navideñas.",
        isFree: true,
        price: 0,
        category: "free",
        eventType: "CHRISTMAS",
        badgeText: "Gratis • Navidad",
        previewColors: ["#0F3827", "#991B1B", "#FEF3C7", "#D97706"],
        palette: {
            primary: "#DC2626",
            secondary: "#144533",
            background: "linear-gradient(180deg, #092318 0%, #0F3827 100%)",
            card: "#123C2C",
            text: "#FEF3C7",
            border: "#1E5840",
            accent: "#D97706",
        },
        decorStyle: "snow",
    },
];

export function getTemplateById(id: string): TemplateDefinition {
    return (
        TEMPLATE_CATALOG.find((t) => t.id === id) ||
        TEMPLATE_CATALOG[0]
    );
}

export function isFreeTemplate(id: string): boolean {
    return FREE_TEMPLATE_IDS.includes(id as TemplateId);
}

export function getTemplatesForEventType(eventType?: EventType): TemplateDefinition[] {
    if (!eventType) return TEMPLATE_CATALOG;
    return TEMPLATE_CATALOG.filter(
        (t) => t.eventType === "ALL" || t.eventType === eventType
    );
}
