"use client";

import { useEffect, useState, useTransition } from "react";
import { Gift, MessageSquareHeart } from "lucide-react";
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
    const [guestName, setGuestName] = useState("");
    const [guestMessage, setGuestMessage] = useState("");
    const [showGiftInDedication, setShowGiftInDedication] = useState(true);
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
        setGuestName("");
        setGuestMessage("");
        setShowGiftInDedication(true);
    }

    function handleConfirm() {
        if (!pendingGift) return;

        startTransition(async () => {
            const result = await markGiftAsPurchasedAction(
                pendingGift.giftId,
                pendingGift.eventSlug,
                selectedQuantity,
                guestName.trim() || undefined,
                guestMessage.trim() || undefined,
                showGiftInDedication
            );

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            window.localStorage.removeItem("pendingPurchasedGift");
            setPendingGift(null);
            setGuestName("");
            setGuestMessage("");
            setShowGiftInDedication(true);
        });
    }

    if (!pendingGift) return null;

    const remainingQuantity = Math.max(
        pendingGift.quantity - pendingGift.purchasedQuantity,
        1
    );

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#3E260E]/45 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[2rem] border-2 border-[#E8C78A] bg-[#FFFDF7] p-6 shadow-[0_24px_70px_rgba(101,67,33,0.28)]">
                <div className="mx-auto flex size-14 items-center justify-center rounded-[1.5rem] bg-[#FFF1B8]">
                    <Gift className="size-7 text-[#B97A22]" />
                </div>

                <h2 className="mt-4 text-center text-2xl font-black text-[#3E260E]">
                    ¿Compraste el regalo?
                </h2>

                <p className="mt-2 text-center text-sm font-bold leading-6 text-[#7A4E28]">
                    Si ya compraste <strong>{pendingGift.giftName}</strong>, actualiza la
                    lista para evitar regalos duplicados.
                </p>

                {remainingQuantity > 1 && (
                    <div className="mt-5">
                        <label className="text-xs font-black uppercase tracking-wide text-[#5A371C]">
                            ¿Cuántos compraste?
                        </label>

                        <select
                            value={selectedQuantity}
                            onChange={(event) => setSelectedQuantity(Number(event.target.value))}
                            className="mt-1.5 h-11 w-full rounded-2xl border-2 border-[#E8C78A] bg-[#FFF8E7] px-4 text-sm font-black text-[#4A2D16] outline-none focus:border-[#F8C63D] focus:ring-4 focus:ring-[#F8D56B]/35"
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

                {/* Apartado para identificarse y dejar mensaje */}
                <div className="mt-5 rounded-2xl border border-[#E8C78A]/70 bg-[#FFF8E7] p-4">
                    <div className="mt-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#B97A22]">
                        <MessageSquareHeart className="size-4" />
                        Deja tu dedicatoria
                    </div>

                    <div className="mt-3 mb-2 space-y-3">
                        <div>
                            <label className="text-xs font-bold text-[#5A371C]">
                                Tu nombre o familia <span className="font-normal text-[#8A6332]">(opcional)</span>
                            </label>
                            <input
                                type="text"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                placeholder="Ej. Tía Carmen, Familia López"
                                maxLength={100}
                                className="mt-1 h-10 w-full rounded-xl border border-[#E8C78A] bg-white px-3 text-sm font-bold text-[#4A2D16] placeholder:text-[#B4966F] outline-none focus:border-[#F8C63D] focus:ring-2 focus:ring-[#F8D56B]/40"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-[#5A371C]">
                                Mensaje o felicitación <span className="font-normal text-[#8A6332]">(opcional)</span>
                            </label>
                            <textarea
                                value={guestMessage}
                                onChange={(e) => setGuestMessage(e.target.value)}
                                placeholder="¡Muchas felicidades! Que disfrutes mucho tu día..."
                                maxLength={1000}
                                rows={3}
                                className="mt-1 w-full resize-none rounded-xl border border-[#E8C78A] bg-white p-3 text-sm font-bold text-[#4A2D16] placeholder:text-[#B4966F] outline-none focus:border-[#F8C63D] focus:ring-2 focus:ring-[#F8D56B]/40"
                            />
                        </div>

                        <label className="flex cursor-pointer items-center gap-2.5 pt-1 select-none text-xs font-bold text-[#5A371C]">
                            <input
                                type="checkbox"
                                checked={showGiftInDedication}
                                onChange={(e) => setShowGiftInDedication(e.target.checked)}
                                className="size-4 rounded border-[#E8C78A] text-[#B97A22] accent-[#B97A22] focus:ring-[#F8D56B]"
                            />
                            <span>Mostrar regalo comprado en dedicatoria</span>
                        </label>
                    </div>
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