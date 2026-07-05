"use client";

import { useEffect, useState, useTransition } from "react";
import { Gift } from "lucide-react";
import { toast } from "sonner";

import { markGiftAsPurchasedAction } from "@/features/public-event/actions/mark-gift-as-purchased-action";

type PendingGift = {
    giftId: string;
    eventSlug: string;
    giftName: string;
    quantity: number;
    purchasedQuantity: number;
    createdAt: number;
};

export function PendingPurchasePrompt() {
    const [pendingGift, setPendingGift] = useState<PendingGift | null>(null);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        function checkPendingGift() {
            const raw = window.localStorage.getItem("pendingPurchasedGift");

            if (!raw) return;

            try {
                const parsed = JSON.parse(raw) as PendingGift;

                if (!parsed.giftId || !parsed.eventSlug) return;

                setPendingGift(parsed);
            } catch {
                window.localStorage.removeItem("pendingPurchasedGift");
            }
        }

        window.addEventListener("focus", checkPendingGift);
        document.addEventListener("visibilitychange", checkPendingGift);

        checkPendingGift();

        return () => {
            window.removeEventListener("focus", checkPendingGift);
            document.removeEventListener("visibilitychange", checkPendingGift);
        };
    }, []);

    function handleClose() {
        window.localStorage.removeItem("pendingPurchasedGift");
        setPendingGift(null);
    }

    function handleConfirm() {
        if (!pendingGift) return;

        startTransition(async () => {
            const result = await markGiftAsPurchasedAction(
                pendingGift.giftId,
                pendingGift.eventSlug,
                selectedQuantity
            );

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success("¡Listo! Regalo marcado como comprado.");
            window.localStorage.removeItem("pendingPurchasedGift");
            setPendingGift(null);
        });
    }

    if (!pendingGift) return null;

    const remainingQuantity = Math.max(
        pendingGift.quantity - pendingGift.purchasedQuantity,
        1
    );

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#3E260E]/45 px-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-[2rem] border-2 border-[#E8C78A] bg-[#FFFDF7] p-6 shadow-[0_24px_70px_rgba(101,67,33,0.28)]">
                <div className="mx-auto flex size-14 items-center justify-center rounded-[1.5rem] bg-[#FFF1B8]">
                    <Gift className="size-7 text-[#B97A22]" />
                </div>

                <h2 className="mt-5 text-center text-2xl font-black text-[#3E260E]">
                    ¿Compraste el regalo?
                </h2>

                <p className="mt-2 text-center text-sm font-bold leading-6 text-[#7A4E28]">
                    Si ya compraste <strong>{pendingGift.giftName}</strong>, actualiza la
                    lista para evitar regalos duplicados.
                </p>

                <div className="mt-6">
                    <label className="text-sm font-black text-[#5A371C]">
                        ¿Cuántos compraste?
                    </label>

                    <select
                        value={selectedQuantity}
                        onChange={(event) => setSelectedQuantity(Number(event.target.value))}
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
                        onClick={handleConfirm}
                        className="inline-flex h-12 items-center justify-center rounded-full bg-[#F8C63D] px-6 text-sm font-black text-[#3E260E] shadow-[0_5px_0_#B97A22] transition hover:-translate-y-0.5 hover:bg-[#FFD85F] disabled:opacity-60"
                    >
                        {isPending ? "Guardando..." : "Sí, marcar como comprado"}
                    </button>

                    <button
                        type="button"
                        disabled={isPending}
                        onClick={handleClose}
                        className="inline-flex h-12 items-center justify-center rounded-full border-2 border-[#E8C78A] bg-white px-6 text-sm font-black text-[#5A371C] transition hover:bg-[#FFF1C9]"
                    >
                        No, todavía no
                    </button>
                </div>
            </div>
        </div>
    );
}