"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Check, Sparkles, ShoppingBag, Loader2, Star, Wand2 } from "lucide-react";
import { TEMPLATE_CATALOG, isFreeTemplate } from "../lib/template-catalog";
import { updateEventTemplateAction } from "../actions/update-event-template-action";
import { YapePlinCheckoutDialog } from "./yape-plin-checkout-dialog";
import { CustomThemeEditor } from "./custom-theme-editor";
import { clearCustomThemeProperties } from "./template-body-theme";
import type { CustomThemeConfig, TemplateDefinition } from "../types";
import type { EventType } from "@prisma/client";

type ManageTemplatesDialogProps = {
    eventId: string;
    currentTemplateId?: string;
    customTheme?: CustomThemeConfig | null;
    purchasedTemplateIds?: string[];
    eventType?: EventType;
    triggerClassName?: string;
    triggerLabel?: string;
};

export function ManageTemplatesDialog({
    eventId,
    currentTemplateId = "storybook",
    customTheme,
    purchasedTemplateIds = [],
    eventType: _eventType,
    triggerClassName,
    triggerLabel = "Gestionar plantillas",
}: ManageTemplatesDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [activeTemplateId, setActiveTemplateId] = useState(currentTemplateId);
    const [unlockedIds, setUnlockedIds] = useState<string[]>(purchasedTemplateIds);
    const [selectedTemplateForCheckout, setSelectedTemplateForCheckout] = useState<TemplateDefinition | null>(null);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<string>(currentTemplateId === "custom" ? "custom" : "catalog");
    const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isPending, startTransition] = useTransition();

    const isUnlocked = (templateId: string) => {
        return isFreeTemplate(templateId) || unlockedIds.includes(templateId);
    };

    const handleApplyTemplate = (template: TemplateDefinition) => {
        setActionMessage(null);
        startTransition(async () => {
            // Actualización inmediata en el DOM para feedback visual instantáneo
            document.body.setAttribute("data-template", template.id);
            document.querySelectorAll("[data-template]").forEach((el) => {
                el.setAttribute("data-template", template.id);
            });
            clearCustomThemeProperties();

            const res = await updateEventTemplateAction(eventId, template.id);
            if (res.success) {
                setActiveTemplateId(template.id);
                setActionMessage({ type: "success", text: res.message });
                router.refresh();
                setTimeout(() => {
                    setActionMessage(null);
                }, 3000);
            } else {
                setActionMessage({ type: "error", text: res.message });
            }
        });
    };

    const handleOpenCheckout = (template: TemplateDefinition) => {
        setSelectedTemplateForCheckout(template);
        setCheckoutOpen(true);
    };

    const handleCheckoutSuccess = (templateId: string) => {
        setUnlockedIds((prev) => [...prev, templateId]);
        setActiveTemplateId(templateId);
        setActionMessage({
            type: "success",
            text: "¡Plantilla desbloqueada y aplicada con éxito!",
        });
    };

    const isCustomActive = activeTemplateId === "custom";
    const currentTemplateName = isCustomActive
        ? "Personalizado"
        : (TEMPLATE_CATALOG.find((t) => t.id === activeTemplateId)?.name || "Miel del Bosque");

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button
                        type="button"
                        className={
                            triggerClassName ||
                            "inline-flex items-center gap-2 rounded-2xl bg-[#FFFDF7] px-4 py-2.5 text-sm font-bold text-[#3E260E] border-2 border-[#E8C78A] shadow-[0_4px_0_#E8C78A] hover:bg-[#FFF8E7] active:translate-y-0.5 active:shadow-none transition-all"
                        }
                    >
                        <div className="flex size-6 items-center justify-center rounded-lg bg-[#FFE9AA] text-[#B97A22]">
                            <Palette className="size-3.5" />
                        </div>
                        <span>{triggerLabel}</span>
                        <span className="hidden sm:inline-flex rounded-full bg-[#FFE9AA] px-2 py-0.5 text-[11px] font-black text-[#8A6332]">
                            {currentTemplateName}
                        </span>
                    </button>
                </DialogTrigger>

                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl p-6 md:p-8 rounded-[2rem] bg-[#FFFDF7] border-2 border-[#E8C78A] shadow-2xl">
                    <DialogHeader className="space-y-2 text-left">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFE9AA] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#B97A22]">
                                <Palette className="size-3.5" />
                                Galería de Estilos
                            </span>
                            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
                                Estilo actual: <strong className="font-black">{currentTemplateName}</strong>
                            </span>
                        </div>

                        <DialogTitle className="text-3xl font-black tracking-tight text-[#3E260E]">
                            Personaliza la apariencia de tu evento
                        </DialogTitle>
                        <DialogDescription className="text-sm font-semibold text-[#7A4E28]">
                            Elige entre nuestras plantillas listas para usar o diseña una paleta personalizada a tu gusto para tu evento público y panel de control.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Notificación de acción */}
                    {actionMessage && (
                        <div
                            className={`mt-4 rounded-xl p-3 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200 ${
                                actionMessage.type === "success"
                                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                    : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                        >
                            {actionMessage.type === "success" ? (
                                <Check className="size-4 shrink-0 text-emerald-600" />
                            ) : null}
                            <span>{actionMessage.text}</span>
                        </div>
                    )}

                    {/* Pestañas principales */}
                    <div className="mt-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-[#FFF1D6] p-1 h-12">
                                <TabsTrigger
                                    value="catalog"
                                    className="rounded-xl text-xs sm:text-sm font-bold text-[#3E260E] data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center justify-center gap-2"
                                >
                                    <Palette className="size-4 text-[#B97A22]" />
                                    <span>Plantillas ({TEMPLATE_CATALOG.length})</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="custom"
                                    className="rounded-xl text-xs sm:text-sm font-bold text-[#3E260E] data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center justify-center gap-2"
                                >
                                    <Wand2 className="size-4 text-[#B97A22]" />
                                    <span>Tema Personalizado</span>
                                    {isCustomActive && (
                                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                    )}
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Contenido según pestaña */}
                    {activeTab === "custom" ? (
                        <div className="mt-6">
                            <CustomThemeEditor
                                eventId={eventId}
                                initialCustomTheme={customTheme}
                                isCurrentActiveTheme={isCustomActive}
                                onSaved={() => {
                                    setActiveTemplateId("custom");
                                    setActionMessage({
                                        type: "success",
                                        text: "¡Tema personalizado aplicado con éxito!",
                                    });
                                    router.refresh();
                                    setTimeout(() => setActionMessage(null), 3500);
                                }}
                            />
                        </div>
                    ) : (
                        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {TEMPLATE_CATALOG.map((template) => {
                                const isActive = activeTemplateId === template.id;
                                const unlocked = isUnlocked(template.id);

                            return (
                                <div
                                    key={template.id}
                                    className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 transition-all duration-200 ${
                                        isActive
                                            ? "border-[#B97A22] bg-white ring-4 ring-[#F8C63D]/30 shadow-md"
                                            : "border-[#E8C78A]/80 bg-white hover:border-[#B97A22]/60 hover:shadow-lg"
                                    }`}
                                >
                                    {/* Cabecera de Color / Muestra visual */}
                                    <div
                                        className="relative h-28 w-full p-4 flex flex-col justify-between transition-transform duration-300"
                                        style={{ background: template.palette.background }}
                                    >
                                        {/* Insignia de categoría */}
                                        <div className="flex items-center justify-between">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-black text-white shadow-xs">
                                                {template.isFree ? (
                                                    "Gratis"
                                                ) : (
                                                    <>
                                                        <Sparkles className="size-3 text-amber-300" />
                                                        S/ {template.price.toFixed(2)}
                                                    </>
                                                )}
                                            </span>

                                            {isActive && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] font-black text-white shadow-xs">
                                                    <Check className="size-3" />
                                                    Activa
                                                </span>
                                            )}

                                            {!isActive && unlocked && !template.isFree && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-purple-600 px-2.5 py-0.5 text-[11px] font-black text-white shadow-xs">
                                                    <Star className="size-3" />
                                                    Desbloqueada
                                                </span>
                                            )}
                                        </div>

                                        {/* Muestras de paleta de colores */}
                                        <div className="flex items-center gap-1.5 self-end rounded-xl bg-black/30 backdrop-blur-xs p-1.5">
                                            {template.previewColors.map((color, i) => (
                                                <div
                                                    key={i}
                                                    className="size-4 rounded-full border border-white/40 shadow-xs"
                                                    style={{ backgroundColor: color }}
                                                    title={color}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Contenido descriptivo */}
                                    <div className="flex flex-1 flex-col justify-between p-5">
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A6332]">
                                                {template.badgeText || (template.isFree ? "Colección Básica" : "Edición Especial")}
                                            </p>
                                            <h3 className="mt-1 text-lg font-black text-[#3E260E]">
                                                {template.name}
                                            </h3>
                                            <p className="mt-1 text-xs font-semibold text-[#B97A22]">
                                                {template.tagline}
                                            </p>
                                            <p className="mt-2 text-xs leading-relaxed text-[#7A4E28] line-clamp-2">
                                                {template.description}
                                            </p>
                                        </div>

                                        {/* Botón de acción */}
                                        <div className="mt-5 pt-3 border-t border-[#E8C78A]/40">
                                            {isActive ? (
                                                <Button
                                                    disabled
                                                    size="sm"
                                                    className="w-full rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 cursor-default opacity-100"
                                                >
                                                    <Check className="mr-1.5 size-4 text-emerald-600" />
                                                    Plantilla en uso
                                                </Button>
                                            ) : unlocked ? (
                                                <Button
                                                    onClick={() => handleApplyTemplate(template)}
                                                    disabled={isPending}
                                                    size="sm"
                                                    className="w-full rounded-xl bg-[#FFF1B8] hover:bg-[#FFE38A] text-[#3E260E] font-black border border-[#E8C78A] shadow-xs active:translate-y-0.5"
                                                >
                                                    {isPending ? (
                                                        <Loader2 className="mr-1.5 size-4 animate-spin" />
                                                    ) : (
                                                        <Palette className="mr-1.5 size-4 text-[#B97A22]" />
                                                    )}
                                                    Aplicar al evento
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => handleOpenCheckout(template)}
                                                    size="sm"
                                                    className="w-full rounded-xl bg-gradient-to-r from-[#742284] to-[#99229E] hover:opacity-95 text-white font-black shadow-xs active:translate-y-0.5"
                                                >
                                                    <ShoppingBag className="mr-1.5 size-4 text-amber-300" />
                                                    Comprar con Yape / Plin (S/ {template.price})
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                </DialogContent>
            </Dialog>

            {/* Modal de Pago Yape / Plin */}
            <YapePlinCheckoutDialog
                open={checkoutOpen}
                onOpenChange={setCheckoutOpen}
                template={selectedTemplateForCheckout}
                eventId={eventId}
                onSuccess={handleCheckoutSuccess}
            />
        </>
    );
}
