"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { Gift } from "lucide-react";
import { toast } from "sonner";

import { markGiftAsPurchasedAction } from "@/features/public-event/actions/mark-gift-as-purchased-action";

type MarkGiftPurchasedButtonProps = {
    giftId: string;
    eventSlug: string;
    disabled?: boolean;
    quantity?: number;
    purchasedQuantity?: number;
};

export function MarkGiftPurchasedButton({
    giftId,
    eventSlug,
    disabled,
    quantity = 1,
    purchasedQuantity = 0,
}: MarkGiftPurchasedButtonProps) {
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setMounted(true);
    }, []);

    const remainingQuantity = Math.max(quantity - purchasedQuantity, 0);
    const needsQuantity = quantity > 1 && remainingQuantity > 1;

    function handleConfirm() {
        const quantityToPurchase = needsQuantity ? selectedQuantity : 1;

        startTransition(async () => {
            const result = await markGiftAsPurchasedAction(
                giftId,
                eventSlug,
                quantityToPurchase
            );

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success("¡Listo! Regalo marcado como comprado.");
            setOpen(false);
        });
    }

    const modal =
        mounted && open
            ? createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#3E260E]/45 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-[2rem] border-2 border-[#E8C78A] bg-[#FFFDF7] p-6 shadow-[0_24px_70px_rgba(101,67,33,0.28)]">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-[1.5rem] bg-[#FFF1B8]">
                            <Gift className="size-7 text-[#B97A22]" />
                        </div>

                        <h2 className="mt-5 text-center text-2xl font-black text-[#3E260E]">
                            ¿Lo marcamos como comprado?
                        </h2>

                        <p className="mt-2 text-center text-sm font-bold leading-6 text-[#7A4E28]">
                            Confirma únicamente si ya compraste este regalo para evitar
                            regalos duplicados.
                        </p>

                        {needsQuantity && (
                            <div className="mt-6">
                                <label className="text-sm font-black text-[#5A371C]">
                                    ¿Cuántos compraste?
                                </label>

                                <select
                                    value={selectedQuantity}
                                    onChange={(event) =>
                                        setSelectedQuantity(Number(event.target.value))
                                    }
                                    className="mt-2 h-12 w-full rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 text-sm font-black text-[#4A2D16] outline-none focus:border-[#F8C63D] focus:ring-4 focus:ring-[#F8D56B]/35"
                                >
                                    {Array.from({ length: remainingQuantity }).map((_, index) => {
                                        const value = index + 1;

                                        return (
                                            <option key={value} value={value}>
                                                {value}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        )}

                        <div className="mt-6 grid gap-3">
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={handleConfirm}
                                className="inline-flex h-12 items-center justify-center rounded-full bg-[#F8C63D] px-6 text-sm font-black text-[#3E260E] shadow-[0_5px_0_#B97A22] transition hover:-translate-y-0.5 hover:bg-[#FFD85F] disabled:opacity-60"
                            >
                                {isPending ? "Guardando..." : "Sí, marcar como comprado"}
                            </button>

                            <button
                                type="button"
                                disabled={isPending}
                                onClick={() => setOpen(false)}
                                className="inline-flex h-12 items-center justify-center rounded-full border-2 border-[#E8C78A] bg-white px-6 text-sm font-black text-[#5A371C] transition hover:bg-[#FFF1C9]"
                            >
                                Todavía no
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )
            : null;

    return (
        <>
            <button
                type="button"
                disabled={disabled || isPending}
                onClick={() => setOpen(true)}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#F8C63D] px-6 text-sm font-black text-[#3E260E] shadow-[0_5px_0_#B97A22] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FFD85F] disabled:pointer-events-none disabled:bg-[#E7DDC7] disabled:text-[#8A7A62] disabled:shadow-none"
            >
                {disabled
                    ? "Lista completa"
                    : isPending
                        ? "Guardando..."
                        : "Marcar como comprado"}
            </button>

            {modal}
        </>
    );
}