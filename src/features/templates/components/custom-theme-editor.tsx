"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
    Sparkles,
    Check,
    Loader2,
    Palette,
    Sun,
    Cloud,
    Snowflake,
    Trees,
    EyeOff,
    CheckCircle2,
    Wand2,
} from "lucide-react";
import {
    DEFAULT_CUSTOM_THEME,
    CUSTOM_THEME_PRESETS,
} from "../lib/template-catalog";
import { saveCustomThemeAction } from "../actions/save-custom-theme-action";
import { applyCustomThemeProperties } from "./template-body-theme";
import { useRouter } from "next/navigation";
import type { CustomThemeConfig, TemplateDecorStyle } from "../types";

type CustomThemeEditorProps = {
    eventId: string;
    initialCustomTheme?: CustomThemeConfig | null;
    isCurrentActiveTheme: boolean;
    onSaved?: (savedConfig: CustomThemeConfig) => void;
};

// Helper to extract a safe 7-character hex code for <input type="color">
function toSafeHex(value?: string, fallback = "#3B82F6"): string {
    if (!value) return fallback;
    const match = value.match(/#[0-9a-fA-F]{6}/);
    if (match) return match[0];
    if (/^#[0-9a-fA-F]{3}$/.test(value)) {
        return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
    }
    return fallback;
}

export function CustomThemeEditor({
    eventId,
    initialCustomTheme,
    isCurrentActiveTheme,
    onSaved,
}: CustomThemeEditorProps) {
    const router = useRouter();
    const [config, setConfig] = useState<CustomThemeConfig>(() => ({
        ...DEFAULT_CUSTOM_THEME,
        ...(initialCustomTheme || {}),
    }));

    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const updateColor = (key: keyof CustomThemeConfig, value: string) => {
        setConfig((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const applyPreset = (presetConfig: CustomThemeConfig) => {
        setConfig(presetConfig);
        setMessage(null);
    };

    const handleSave = () => {
        setMessage(null);
        startTransition(async () => {
            // Aplicar de inmediato en el DOM para retroalimentación visual instantánea
            document.body.setAttribute("data-template", "custom");
            document.querySelectorAll("[data-template]").forEach((el) => {
                el.setAttribute("data-template", "custom");
            });
            applyCustomThemeProperties(config);

            const res = await saveCustomThemeAction(eventId, config);
            if (res.success) {
                setMessage({ type: "success", text: res.message });
                onSaved?.(config);
                router.refresh();
            } else {
                setMessage({ type: "error", text: res.message });
            }
        });
    };

    const decorOptions: {
        id: TemplateDecorStyle;
        label: string;
        description: string;
        icon: React.ElementType;
    }[] = [
        {
            id: "none",
            label: "Sin animación",
            description: "Minimalista y limpio",
            icon: EyeOff,
        },
        {
            id: "sparkles",
            label: "Destellos de Luz",
            description: "Glimmers y destellos sutiles",
            icon: Sparkles,
        },
        {
            id: "bubbles",
            label: "Nubes y Esferas",
            description: "Tierno y suave",
            icon: Cloud,
        },
        {
            id: "snow",
            label: "Copos Mágicos",
            description: "Nevada festiva",
            icon: Snowflake,
        },
        {
            id: "forest",
            label: "Miel y Hojas",
            description: "Abejas y naturaleza viva",
            icon: Trees,
        },
    ];

    const colorPickers = [
        {
            key: "background" as const,
            label: "Fondo General",
            description: "El color o fondo principal de la página",
            fallback: "#F8FAFC",
        },
        {
            key: "card" as const,
            label: "Fondo de Tarjetas",
            description: "Contenedores principales y regalos",
            fallback: "#FFFFFF",
        },
        {
            key: "cardSubtle" as const,
            label: "Fondo de Bloques Secundarios",
            description: "Subpaneles, resumen y campos",
            fallback: "#F1F5F9",
        },
        {
            key: "border" as const,
            label: "Bordes y Divisores",
            description: "Líneas de separación y marcos",
            fallback: "#CBD5E1",
        },
        {
            key: "textTitle" as const,
            label: "Títulos y Encabezados",
            description: "Títulos principales y nombres",
            fallback: "#0F172A",
        },
        {
            key: "textBody" as const,
            label: "Texto Regular",
            description: "Párrafos, notas e instrucciones",
            fallback: "#334155",
        },
        {
            key: "accent" as const,
            label: "Botones y Resaltado",
            description: "Botones principales y elementos clave",
            fallback: "#0EA5E9",
        },
        {
            key: "accentText" as const,
            label: "Texto del Botón",
            description: "Color de texto dentro de los botones",
            fallback: "#FFFFFF",
        },
    ];

    return (
        <div className="space-y-6 text-left">
            {/* Cabecera del Creador */}
            <div className="rounded-2xl bg-amber-50/70 p-4 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-amber-400/20 text-amber-800">
                        <Wand2 className="size-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-[#3E260E]">
                            Diseñador de Tema Personalizado
                        </h4>
                        <p className="text-xs text-[#7A4E28]">
                            Define la paleta exacta de tu marca o evento con total libertad.
                        </p>
                    </div>
                </div>

                {isCurrentActiveTheme && (
                    <span className="inline-flex items-center gap-1 self-start sm:self-auto rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="size-3.5" />
                        Tema actualmente activo
                    </span>
                )}
            </div>

            {/* Presets Rápidos */}
            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-[#7A4E28] flex items-center gap-1.5">
                    <Palette className="size-3.5" />
                    Inspiración rápida (Paletas predefinidas)
                </label>
                <div className="flex flex-wrap gap-2">
                    {CUSTOM_THEME_PRESETS.map((preset) => (
                        <button
                            key={preset.name}
                            type="button"
                            onClick={() => applyPreset(preset.config)}
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-[#3E260E] border border-[#E8C78A] shadow-sm hover:bg-[#FFF8E7] active:scale-95 transition-all"
                        >
                            <span
                                className="size-3.5 rounded-full border border-black/10 shadow-xs"
                                style={{
                                    backgroundColor: toSafeHex(preset.config.accent),
                                }}
                            />
                            <span>{preset.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Selector de Efecto de Fondo */}
            <div className="space-y-2.5">
                <label className="text-xs font-black uppercase tracking-wider text-[#7A4E28] flex items-center gap-1.5">
                    <Sparkles className="size-3.5" />
                    Efecto ambiental animado
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {decorOptions.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = config.decorStyle === opt.id;
                        return (
                            <button
                                key={opt.id}
                                type="button"
                                onClick={() =>
                                    setConfig((prev) => ({ ...prev, decorStyle: opt.id }))
                                }
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 text-center transition-all ${
                                    isSelected
                                        ? "border-[#B97A22] bg-[#FFF8E7] shadow-sm ring-2 ring-[#B97A22]/30"
                                        : "border-[#E8C78A]/50 bg-white hover:border-[#E8C78A] hover:bg-[#FFFDF7]"
                                }`}
                            >
                                <Icon
                                    className={`size-5 mb-1.5 ${
                                        isSelected ? "text-[#B97A22]" : "text-stone-400"
                                    }`}
                                />
                                <span className="text-xs font-black text-[#3E260E] line-clamp-1">
                                    {opt.label}
                                </span>
                                <span className="text-[10px] text-stone-500 line-clamp-1">
                                    {opt.description}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Grilla: Controles de Colores + Previsualización en Vivo */}
            <div className="grid lg:grid-cols-12 gap-6 items-start">
                {/* Selector de Colores (7 columnas) */}
                <div className="lg:col-span-7 space-y-3.5">
                    <label className="text-xs font-black uppercase tracking-wider text-[#7A4E28] flex items-center gap-1.5">
                        <Sun className="size-3.5" />
                        Colores de los elementos
                    </label>

                    <div className="grid sm:grid-cols-2 gap-3">
                        {colorPickers.map((item) => {
                            const rawValue = (config[item.key] as string) || item.fallback;
                            const hexValue = toSafeHex(rawValue, item.fallback);

                            return (
                                <div
                                    key={item.key}
                                    className="p-3 rounded-xl bg-white border border-[#E8C78A]/60 shadow-xs space-y-1.5"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-[#3E260E]">
                                            {item.label}
                                        </span>
                                        <span className="text-[10px] font-mono font-bold text-stone-400">
                                            {hexValue.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="relative size-8 rounded-lg overflow-hidden border border-stone-200 cursor-pointer shadow-inner shrink-0">
                                            <input
                                                type="color"
                                                value={hexValue}
                                                onChange={(e) =>
                                                    updateColor(item.key, e.target.value)
                                                }
                                                className="absolute inset-0 size-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                                            />
                                        </label>
                                        <input
                                            type="text"
                                            value={rawValue}
                                            onChange={(e) =>
                                                updateColor(item.key, e.target.value)
                                            }
                                            className="w-full text-xs font-mono font-bold px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#B97A22]"
                                            placeholder="#000000"
                                        />
                                    </div>
                                    <p className="text-[10px] text-stone-500 leading-tight">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Previsualización en Vivo (5 columnas) */}
                <div className="lg:col-span-5 space-y-3">
                    <label className="text-xs font-black uppercase tracking-wider text-[#7A4E28] flex items-center gap-1.5">
                        <Sparkles className="size-3.5" />
                        Vista previa en tiempo real
                    </label>

                    <div
                        className="rounded-3xl p-5 border shadow-md transition-colors duration-300 relative overflow-hidden"
                        style={{
                            background: config.background,
                            borderColor: config.border,
                        }}
                    >
                        {/* Indicador de ambient decor */}
                        <div className="mb-3 flex items-center justify-between">
                            <span
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black shadow-xs"
                                style={{
                                    backgroundColor: config.accent + "25",
                                    color: config.accent,
                                }}
                            >
                                <Sparkles className="size-3" />
                                {decorOptions.find((d) => d.id === config.decorStyle)?.label ||
                                    "Sin animación"}
                            </span>
                            <span
                                className="text-[10px] font-bold opacity-60"
                                style={{ color: config.textBody }}
                            >
                                Simulación de evento
                            </span>
                        </div>

                        {/* Tarjeta de demostración */}
                        <div
                            className="rounded-2xl p-4 border shadow-sm transition-colors duration-300 space-y-3"
                            style={{
                                backgroundColor: config.card,
                                borderColor: config.border,
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="size-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm"
                                    style={{
                                        backgroundColor: config.accent,
                                        color: config.accentText,
                                    }}
                                >
                                    🎁
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h5
                                        className="font-black text-sm truncate"
                                        style={{ color: config.textTitle }}
                                    >
                                        Juego de Vajilla Nórdica
                                    </h5>
                                    <p
                                        className="text-xs truncate"
                                        style={{ color: config.textBody }}
                                    >
                                        Regalo para nuestro nuevo hogar
                                    </p>
                                </div>
                            </div>

                            {/* Subpanel secundario */}
                            <div
                                className="rounded-xl p-3 border text-xs space-y-1 transition-colors duration-300"
                                style={{
                                    backgroundColor: config.cardSubtle,
                                    borderColor: config.border,
                                }}
                            >
                                <div className="flex justify-between font-bold">
                                    <span style={{ color: config.textBody }}>Meta sugerida:</span>
                                    <span style={{ color: config.textTitle }}>S/ 350.00</span>
                                </div>
                                <div className="w-full bg-black/10 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-300"
                                        style={{
                                            backgroundColor: config.accent,
                                            width: "65%",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Botón de acción */}
                            <button
                                type="button"
                                className="w-full py-2.5 px-4 rounded-xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 hover:opacity-95 active:scale-98"
                                style={{
                                    backgroundColor: config.accent,
                                    color: config.accentText,
                                }}
                            >
                                <Sparkles className="size-3.5" />
                                Regalar este detalle
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mensajes de feedback */}
            {message && (
                <div
                    className={`rounded-xl p-3 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200 ${
                        message.type === "success"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                >
                    {message.type === "success" ? (
                        <Check className="size-4 shrink-0 text-emerald-600" />
                    ) : null}
                    <span>{message.text}</span>
                </div>
            )}

            {/* Botón de Guardado */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-[#E8C78A]/40">
                <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isPending}
                    className="w-full sm:w-auto h-11 px-6 rounded-2xl bg-[#F8C63D] hover:bg-[#FFD85F] text-[#3E260E] font-black border-2 border-[#B97A22] shadow-[0_4px_0_#B97A22] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="size-4 animate-spin text-[#3E260E]" />
                            Guardando y aplicando tema...
                        </>
                    ) : (
                        <>
                            <Wand2 className="size-4 text-[#B97A22]" />
                            Guardar y aplicar tema personalizado
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
