"use client";

import { useState, useTransition } from "react";
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
    const [open, setOpen] = useState(false);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [isPending, startTransition] = useTransition();

    const remainingQuantity = Math.max(quantity - purchasedQuantity, 0);
    const needsQuantity = quantity > 1 && remainingQuantity > 1;

    function handleOpen() {
        if (disabled || isPending) return;

        if (!needsQuantity) {
            handleConfirm(1);
            return;
        }

        setSelectedQuantity(1);
        setOpen(true);
    }

    function handleConfirm(quantityToPurchase: number) {
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

            toast.success("¡Qué lindo! Regalo elegido correctamente.");
            setOpen(false);
        });
    }

    return (
        <>
            <button
                type="button"
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#F8C63D] px-6 text-sm font-black text-[#3E260E] shadow-[0_5px_0_#B97A22] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FFD85F] disabled:pointer-events-none disabled:bg-[#E7DDC7] disabled:text-[#8A7A62] disabled:shadow-none"
                disabled={disabled || isPending}
                onClick={handleOpen}
            >
                {disabled ? "Lista completa" : isPending ? "Guardando..." : "Elegir regalo"}
            </button>

            {open ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3E260E]/40 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-[2rem] border-2 border-[#E8C78A] bg-[#FFFDF7] p-6 shadow-[0_24px_70px_rgba(101,67,33,0.28)]">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-[1.5rem] bg-[#FFF1B8]">
                            <Gift className="size-7 text-[#B97A22]" />
                        </div>

                        <h2 className="mt-5 text-center text-2xl font-black text-[#3E260E]">
                            ¿Cuántos elegirás?
                        </h2>

                        <p className="mt-2 text-center text-sm font-bold leading-6 text-[#7A4E28]">
                            Quedan {remainingQuantity} disponibles de este regalo.
                        </p>

                        <div className="mt-6">
                            <label className="text-sm font-black text-[#5A371C]">
                                Cantidad
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

                        <div className="mt-6 grid gap-3">
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={() => handleConfirm(selectedQuantity)}
                                className="inline-flex h-12 items-center justify-center rounded-full bg-[#F8C63D] px-6 text-sm font-black text-[#3E260E] shadow-[0_5px_0_#B97A22] transition hover:-translate-y-0.5 hover:bg-[#FFD85F] disabled:opacity-60"
                            >
                                {isPending ? "Guardando..." : "Confirmar"}
                            </button>

                            <button
                                type="button"
                                disabled={isPending}
                                onClick={() => setOpen(false)}
                                className="inline-flex h-12 items-center justify-center rounded-full border-2 border-[#E8C78A] bg-white px-6 text-sm font-black text-[#5A371C] transition hover:bg-[#FFF1C9]"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}