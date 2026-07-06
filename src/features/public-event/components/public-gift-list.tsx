/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import { GiftIcon, Search } from "lucide-react";

import { MarkGiftPurchasedButton } from "@/features/public-event/components/mark-gift-purchased-button";
import { PurchaseGiftButton } from "@/features/public-event/components/purchase-gift-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PublicGift = {
    id: string;
    name: string;
    imageUrl: string | null;
    brand: string | null;
    price: string | null;
    priceNumber: number | null;
    currency: string;
    description: string | null;
    color: string | null;
    size: string | null;
    dimensions: string | null;
    originalUrl: string | null;
    status: "AVAILABLE" | "PURCHASED";
    quantity: number;
    purchasedQuantity: number;
};

type PublicGiftListProps = {
    eventSlug: string;
    gifts: PublicGift[];
};

export function PublicGiftList({ eventSlug, gifts }: PublicGiftListProps) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"ALL" | "AVAILABLE" | "PURCHASED">(
        "ALL"
    );
    const [sort, setSort] = useState<
        "MANUAL" | "AZ" | "ZA" | "PRICE_ASC" | "PRICE_DESC"
    >("MANUAL");

    const filteredGifts = useMemo(() => {
        let result = [...gifts];

        if (filter !== "ALL") {
            result = result.filter((gift) => gift.status === filter);
        }

        if (search.trim()) {
            result = result.filter((gift) =>
                gift.name.toLowerCase().includes(search.trim().toLowerCase())
            );
        }

        if (sort === "AZ") result.sort((a, b) => a.name.localeCompare(b.name));
        if (sort === "ZA") result.sort((a, b) => b.name.localeCompare(a.name));

        if (sort === "PRICE_ASC") {
            result.sort(
                (a, b) => (a.priceNumber ?? Infinity) - (b.priceNumber ?? Infinity)
            );
        }

        if (sort === "PRICE_DESC") {
            result.sort(
                (a, b) => (b.priceNumber ?? -Infinity) - (a.priceNumber ?? -Infinity)
            );
        }

        return result;
    }, [gifts, search, filter, sort]);

    return (
        <div>
            <div className="rounded-[2rem] border-2 border-[#E8C78A] bg-[#FFFDF7] p-4 shadow-[0_14px_35px_rgba(101,67,33,0.12)]">
                <div className="grid gap-3 lg:grid-cols-[1fr_180px_220px]">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#C78A21]" />
                        <Input
                            placeholder="Buscar regalo..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="h-13 rounded-full border-2 border-[#E7C37B] bg-[#FFF8E8] pl-12 text-base font-bold text-[#5A371C] placeholder:text-[#9C7A4C]"
                        />
                    </div>

                    <select
                        className="h-13 rounded-full border-2 border-[#E7C37B] bg-[#FFF8E8] px-4 text-base font-bold text-[#5A371C]"
                        value={filter}
                        onChange={(event) => setFilter(event.target.value as typeof filter)}
                    >
                        <option value="ALL">Todos</option>
                        <option value="AVAILABLE">Disponibles</option>
                        <option value="PURCHASED">Comprados</option>
                    </select>

                    <select
                        className="h-13 rounded-full border-2 border-[#E7C37B] bg-[#FFF8E8] px-4 text-base font-bold text-[#5A371C]"
                        value={sort}
                        onChange={(event) => setSort(event.target.value as typeof sort)}
                    >
                        <option value="MANUAL">Orden original</option>
                        <option value="AZ">Nombre A-Z</option>
                        <option value="ZA">Nombre Z-A</option>
                        <option value="PRICE_ASC">Precio menor a mayor</option>
                        <option value="PRICE_DESC">Precio mayor a menor</option>
                    </select>
                </div>
            </div>

            {filteredGifts.length === 0 ? (
                <div className="mt-8 rounded-[2rem] border-2 border-dashed border-[#E7C37B] bg-white/80 p-10 text-center">
                    <h3 className="text-2xl font-black text-[#3B2412]">
                        No encontramos regalos
                    </h3>
                    <p className="mx-auto mt-2 max-w-md text-base font-bold leading-7 text-[#7A5631]">
                        Prueba cambiando la búsqueda o el filtro.
                    </p>
                </div>
            ) : (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredGifts.map((gift) => (
                        <article
                            key={gift.id}
                            className="group overflow-hidden rounded-[2rem] border-2 border-[#E8C98B] bg-white shadow-[0_10px_30px_rgba(111,72,29,0.12)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(111,72,29,0.18)]"
                        >
                            <div className="relative bg-[radial-gradient(circle_at_50%_35%,#FFF1B8,transparent_55%),#FFF8E7]">
                                {gift.imageUrl ? (
                                    <img
                                        src={gift.imageUrl}
                                        alt={gift.name}
                                        className="aspect-square w-full object-contain p-8 transition duration-200 group-hover:scale-[1.03]"
                                    />
                                ) : (
                                    <div className="flex aspect-square w-full items-center justify-center">
                                        <GiftIcon className="size-14 text-[#C78A21]" />
                                    </div>
                                )}

                                <div className="absolute left-4 top-4">
                                    <span
                                        className={
                                            gift.status === "AVAILABLE"
                                                ? "rounded-full bg-[#EFFFF7] px-3 py-1 text-xs font-black text-[#2F6B4F]"
                                                : "rounded-full bg-[#FFF0F4] px-3 py-1 text-xs font-black text-[#9A4660]"
                                        }
                                    >
                                        {gift.status === "AVAILABLE" ? "Disponible" : "Comprado"}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="line-clamp-2 text-2xl font-black leading-tight text-[#3B2412]">
                                    {gift.name}
                                </h3>

                                {gift.brand ? (
                                    <p className="mt-2 text-base font-bold text-[#7A5631]">
                                        {gift.brand}
                                    </p>
                                ) : null}

                                {gift.price ? (
                                    <p className="mt-4 text-2xl font-black text-[#5A371C]">
                                        {gift.currency} {gift.price}
                                    </p>
                                ) : null}

                                {gift.quantity > 1 ? (
                                    <div className="mt-3 rounded-full bg-[#FFF1B8] px-4 py-2 text-sm font-black text-[#5A371C]">
                                        Elegidos {gift.purchasedQuantity} de {gift.quantity}
                                    </div>
                                ) : null}

                                {gift.description ? (
                                    <p className="mt-3 line-clamp-2 text-sm font-semibold leading-6 text-[#8A6332]">
                                        {gift.description}
                                    </p>
                                ) : null}
                               
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {gift.color ? (
                                        <span className="rounded-full bg-[#FFF1B8] px-3 py-1 text-xs font-black text-[#5A371C]">
                                            Color: {gift.color}
                                        </span>
                                    ) : null}

                                    {gift.size ? (
                                        <span className="rounded-full bg-[#FFF1B8] px-3 py-1 text-xs font-black text-[#5A371C]">
                                            Talla: {gift.size}
                                        </span>
                                    ) : null}

                                    {gift.dimensions ? (
                                        <span className="rounded-full bg-[#FFF1B8] px-3 py-1 text-xs font-black text-[#5A371C]">
                                            Medidas: {gift.dimensions}
                                        </span>
                                    ) : null}
                                </div>
                            </div>

                            <div className="grid gap-3 border-t-2 border-[#F1D7A5] bg-[#FFF8E7] p-5">
                                {gift.originalUrl ? (
                                    <PurchaseGiftButton
                                        originalUrl={gift.originalUrl}
                                        giftId={gift.id}
                                        eventSlug={eventSlug}
                                        giftName={gift.name}
                                        quantity={gift.quantity}
                                        purchasedQuantity={gift.purchasedQuantity}
                                    />
                                ) : null}

                                <MarkGiftPurchasedButton
                                    giftId={gift.id}
                                    eventSlug={eventSlug}
                                    disabled={gift.status === "PURCHASED"}
                                    quantity={gift.quantity}
                                    purchasedQuantity={gift.purchasedQuantity}
                                />
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}