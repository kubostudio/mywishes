"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, Gift } from "lucide-react";

type PurchaseGiftButtonProps = {
    originalUrl: string;
    giftId: string;
    eventSlug: string;
    giftName: string;
    quantity: number;
    purchasedQuantity: number;
};

export function PurchaseGiftButton({
    originalUrl,
    giftId,
    eventSlug,
    giftName,
    quantity,
    purchasedQuantity,
}: PurchaseGiftButtonProps) {
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    function handleGoToStore() {
        window.localStorage.setItem(
            "pendingPurchasedGift",
            JSON.stringify({
                giftId,
                eventSlug,
                giftName,
                quantity,
                purchasedQuantity,
                createdAt: Date.now(),
            })
        );

        setOpen(false);
        window.open(originalUrl, "_blank", "noopener,noreferrer");
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
                            Antes de ir a la tienda
                        </h2>

                        <div className="mt-5 space-y-4 text-sm font-bold leading-6 text-[#7A4E28]">
                            <div className="rounded-[1.5rem] bg-[#FFF8E7] p-4">
                                <p className="font-black text-[#3E260E]">
                                    1. Ve a la tienda y compra el regalo
                                </p>
                                <p className="mt-1">
                                    Se abrirá la página del producto para que puedas comprarlo.
                                </p>
                            </div>

                            <div className="rounded-[1.5rem] bg-[#FFF8E7] p-4">
                                <p className="font-black text-[#3E260E]">
                                    2. Regresa y márcalo como comprado
                                </p>
                                <p className="mt-1">
                                    Así evitamos que otra persona compre el mismo regalo.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-3">
                            <button
                                type="button"
                                onClick={handleGoToStore}
                                className="inline-flex h-12 items-center justify-center rounded-full bg-[#F8C63D] px-6 text-sm font-black text-[#3E260E] shadow-[0_5px_0_#B97A22] transition hover:-translate-y-0.5 hover:bg-[#FFD85F]"
                            >
                                Entendido, ir a tienda
                            </button>

                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="inline-flex h-12 items-center justify-center rounded-full border-2 border-[#E8C78A] bg-white px-6 text-sm font-black text-[#5A371C] transition hover:bg-[#FFF1C9]"
                            >
                                Cancelar
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
                onClick={() => setOpen(true)}
                className="inline-flex h-12 w-full items-center justify-center rounded-full border-2 border-[#E8C78A] bg-white px-6 text-sm font-black text-[#5A371C] transition hover:bg-[#FFF1C9]"
            >
                Comprar
                <ExternalLink className="ml-2 size-4" />
            </button>

            {modal}
        </>
    );
}