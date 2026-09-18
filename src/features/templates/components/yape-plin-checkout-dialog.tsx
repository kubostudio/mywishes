"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Copy, Check, Phone, User, ShieldCheck, Loader2, Sparkles } from "lucide-react";
import { DEFAULT_BANK_PAYMENT_INFO } from "../lib/template-catalog";
import { purchaseTemplateAction } from "../actions/purchase-template-action";
import type { TemplateDefinition } from "../types";

type YapePlinCheckoutDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    template: TemplateDefinition | null;
    eventId?: string;
    onSuccess?: (templateId: string) => void;
};

export function YapePlinCheckoutDialog({
    open,
    onOpenChange,
    template,
    eventId,
    onSuccess,
}: YapePlinCheckoutDialogProps) {
    const [selectedMethod, setSelectedMethod] = useState<"YAPE" | "PLIN">("YAPE");
    const [operationCode, setOperationCode] = useState("");
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [isPending, startTransition] = useTransition();

    if (!template) return null;

    const paymentInfo = DEFAULT_BANK_PAYMENT_INFO;
    const activeInfo = selectedMethod === "YAPE" ? paymentInfo.yape : paymentInfo.plin;

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleConfirmPayment = () => {
        setStatusMessage(null);
        startTransition(async () => {
            const res = await purchaseTemplateAction({
                templateId: template.id,
                eventId,
                paymentMethod: selectedMethod,
                operationCode: operationCode.trim() || undefined,
            });

            if (res.success) {
                setStatusMessage({ type: "success", text: res.message });
                setTimeout(() => {
                    onOpenChange(false);
                    onSuccess?.(template.id);
                }, 1200);
            } else {
                setStatusMessage({ type: "error", text: res.message });
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-[500px] p-6 rounded-[2rem] bg-[#FFFDF7] border-2 border-[#E8C78A] shadow-2xl">
                <DialogHeader className="space-y-2 text-left">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFE9AA] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#B97A22]">
                            <Sparkles className="size-3.5" />
                            Plantilla Premium
                        </span>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                            S/ {template.price.toFixed(2)} PEN
                        </span>
                    </div>

                    <DialogTitle className="text-2xl font-black tracking-tight text-[#3E260E]">
                        Adquirir {template.name}
                    </DialogTitle>
                    <DialogDescription className="text-sm font-semibold text-[#7A4E28]">
                        Paga al instante con Yape o Plin para desbloquear este diseño exclusivo para tus eventos.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-5">
                    {/* Selector de Método de Pago */}
                    <Tabs
                        value={selectedMethod}
                        onValueChange={(val) => setSelectedMethod(val as "YAPE" | "PLIN")}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-[#FFF1D6] p-1 h-12">
                            <TabsTrigger
                                value="YAPE"
                                className="rounded-xl font-bold text-[#3E260E] data-[state=active]:bg-[#742284] data-[state=active]:text-white transition-all duration-200"
                            >
                                <span className="mr-1.5 size-2.5 rounded-full bg-[#00D1D2] inline-block" />
                                Yape
                            </TabsTrigger>
                            <TabsTrigger
                                value="PLIN"
                                className="rounded-xl font-bold text-[#3E260E] data-[state=active]:bg-[#00D1D2] data-[state=active]:text-[#0F172A] transition-all duration-200"
                            >
                                <span className="mr-1.5 size-2.5 rounded-full bg-[#0052CC] inline-block" />
                                Plin
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* Contenedor del QR y Datos Bancarios */}
                    <div className="rounded-2xl border-2 border-[#E8C78A]/70 bg-gradient-to-b from-[#FFFDF7] to-[#FFF8E7] p-5 shadow-sm text-center">
                        {/* Ilustración QR estilizada de alta calidad */}
                        <div className="mx-auto flex size-44 items-center justify-center rounded-2xl border-2 border-[#E8C78A] bg-white p-3 shadow-inner">
                            <div className="relative flex size-full flex-col items-center justify-center rounded-xl bg-neutral-900 p-2 text-white">
                                <QrCode className="size-28 text-white opacity-95" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className={`flex size-10 items-center justify-center rounded-full shadow-md ${selectedMethod === "YAPE" ? "bg-[#742284] text-white" : "bg-[#00D1D2] text-[#0F172A]"} font-black text-xs`}>
                                        {selectedMethod === "YAPE" ? "Y" : "P"}
                                    </div>
                                </div>
                                <span className="mt-1 text-[10px] font-black uppercase tracking-wider text-amber-300">
                                    Escanea aquí
                                </span>
                            </div>
                        </div>

                        {/* Datos para Yapear / Plinear */}
                        <div className="mt-4 space-y-2 text-left">
                            <div className="flex items-center justify-between rounded-xl bg-[#FFF8E7] px-3.5 py-2.5 border border-[#E8C78A]/50">
                                <div className="flex items-center gap-2.5">
                                    <Phone className="size-4 text-[#B97A22]" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#8A6332]">
                                            Número Celular ({selectedMethod})
                                        </p>
                                        <p className="text-sm font-black text-[#3E260E]">
                                            {activeInfo.phone}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleCopy(activeInfo.phone.replace(/\s+/g, ""), "phone")}
                                    className="h-8 px-2.5 text-xs font-bold text-[#B97A22] hover:bg-[#FFE9AA]/60"
                                >
                                    {copiedField === "phone" ? (
                                        <Check className="size-3.5 text-emerald-600" />
                                    ) : (
                                        <Copy className="size-3.5" />
                                    )}
                                    <span className="ml-1">{copiedField === "phone" ? "Copiado" : "Copiar"}</span>
                                </Button>
                            </div>

                            <div className="flex items-center justify-between rounded-xl bg-[#FFF8E7] px-3.5 py-2.5 border border-[#E8C78A]/50">
                                <div className="flex items-center gap-2.5">
                                    <User className="size-4 text-[#B97A22]" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#8A6332]">
                                            Titular de la cuenta
                                        </p>
                                        <p className="text-sm font-bold text-[#3E260E]">
                                            {activeInfo.holderName}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleCopy(activeInfo.holderName, "holder")}
                                    className="h-8 px-2.5 text-xs font-bold text-[#B97A22] hover:bg-[#FFE9AA]/60"
                                >
                                    {copiedField === "holder" ? (
                                        <Check className="size-3.5 text-emerald-600" />
                                    ) : (
                                        <Copy className="size-3.5" />
                                    )}
                                    <span className="ml-1">{copiedField === "holder" ? "Copiado" : "Copiar"}</span>
                                </Button>
                            </div>

                            <div className="flex items-center justify-between rounded-xl bg-amber-50 px-3.5 py-2 border border-amber-200">
                                <span className="text-xs font-bold text-[#8A6332]">Monto exacto a transferir:</span>
                                <span className="text-sm font-black text-[#B97A22]">S/ {template.price.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Confirmación y Código de Operación */}
                    <div className="space-y-2">
                        <Label htmlFor="operationCode" className="text-xs font-bold text-[#3E260E]">
                            Número de Operación / Referencia (Opcional)
                        </Label>
                        <Input
                            id="operationCode"
                            placeholder="Ej. 7482910"
                            value={operationCode}
                            onChange={(e) => setOperationCode(e.target.value)}
                            className="rounded-xl border-[#E8C78A] bg-white font-medium text-[#3E260E] focus-visible:ring-[#F8C63D]"
                        />
                        <p className="text-[11px] font-medium text-[#8A6332]">
                            Ingresa el código que figura en tu constancia de pago de {selectedMethod}.
                        </p>
                    </div>

                    {/* Mensaje de estado */}
                    {statusMessage && (
                        <div
                            className={`rounded-xl p-3 text-xs font-bold flex items-center gap-2 ${
                                statusMessage.type === "success"
                                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                    : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                        >
                            {statusMessage.type === "success" ? (
                                <ShieldCheck className="size-4 shrink-0 text-emerald-600" />
                            ) : null}
                            <span>{statusMessage.text}</span>
                        </div>
                    )}

                    {/* Botones de acción */}
                    <div className="flex flex-col gap-2 pt-2">
                        <Button
                            type="button"
                            onClick={handleConfirmPayment}
                            disabled={isPending}
                            className="w-full h-12 rounded-2xl bg-[#F8C63D] text-[#3E260E] font-black text-base shadow-[0_4px_0_#B97A22] hover:bg-[#FFE38A] active:translate-y-1 active:shadow-none transition-all"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 size-5 animate-spin" />
                                    Verificando pago...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="mr-2 size-5 text-[#B97A22]" />
                                    Confirmar y Activar Plantilla
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                            className="rounded-xl font-bold text-[#8A6332] hover:bg-[#FFE9AA]/40"
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
