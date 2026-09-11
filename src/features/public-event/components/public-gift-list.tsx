/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useRef, useState } from "react";
import { Check, GiftIcon, Search } from "lucide-react";

import { MarkGiftPurchasedButton } from "@/features/public-event/components/mark-gift-purchased-button";
import { PurchaseGiftButton } from "@/features/public-event/components/purchase-gift-button";
import { Input } from "@/components/ui/input";
import { type PageSizeOption, StoryPagination } from "@/components/storybook/story-pagination";
import { cn } from "@/lib/utils";

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
    const listTopRef = useRef<HTMLDivElement>(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"ALL" | "AVAILABLE" | "PURCHASED">(
        "ALL"
    );
    const [sort, setSort] = useState<
        "MANUAL" | "AZ" | "ZA" | "PRICE_ASC" | "PRICE_DESC"
    >("MANUAL");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState<PageSizeOption>(6);

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

    const effectivePageSize = pageSize === "all" ? (filteredGifts.length || 1) : pageSize;
    const totalPages = Math.ceil(filteredGifts.length / effectivePageSize) || 1;
    const validCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (validCurrentPage - 1) * effectivePageSize;
    const paginatedGifts =
        pageSize === "all"
            ? filteredGifts
            : filteredGifts.slice(startIndex, startIndex + effectivePageSize);
    const showPagination = filteredGifts.length > 3;

    function handlePageChange(page: number) {
        setCurrentPage(page);
        listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function handlePageSizeChange(newSize: PageSizeOption) {
        setPageSize(newSize);
        setCurrentPage(1);
        listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    return (
        <div ref={listTopRef} className="scroll-mt-6">
            <div className="rounded-[2rem] border-2 border-[#E8C78A] bg-[#FFFDF7] p-4 shadow-[0_14px_35px_rgba(101,67,33,0.12)]">
                <div className="grid gap-3 lg:grid-cols-[1fr_180px_220px]">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#C78A21]" />
                        <Input
                            placeholder="Buscar regalo..."
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setCurrentPage(1);
                            }}
                            className="h-13 rounded-full border-2 border-[#E7C37B] bg-[#FFF8E8] pl-12 text-base font-bold text-[#5A371C] placeholder:text-[#9C7A4C]"
                        />
                    </div>

                    <select
                        className="h-13 rounded-full border-2 border-[#E7C37B] bg-[#FFF8E8] px-4 text-base font-bold text-[#5A371C]"
                        value={filter}
                        onChange={(event) => {
                            setFilter(event.target.value as typeof filter);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="ALL">Todos</option>
                        <option value="AVAILABLE">Disponibles</option>
                        <option value="PURCHASED">Comprados</option>
                    </select>

                    <select
                        className="h-13 rounded-full border-2 border-[#E7C37B] bg-[#FFF8E8] px-4 text-base font-bold text-[#5A371C]"
                        value={sort}
                        onChange={(event) => {
                            setSort(event.target.value as typeof sort);
                            setCurrentPage(1);
                        }}
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
                <>
                    {showPagination ? (
                        <StoryPagination
                            className="mt-6"
                            currentPage={validCurrentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            totalItems={filteredGifts.length}
                            pageSize={pageSize}
                            onPageSizeChange={handlePageSizeChange}
                            itemLabel="regalos"
                        />
                    ) : null}

                    <div className={cn("grid gap-6 sm:grid-cols-2 xl:grid-cols-3", showPagination ? "mt-6" : "mt-8")}>
                        {paginatedGifts.map((gift) => (
                            <article
                                key={gift.id}
                                className="group flex h-full flex-col overflow-hidden rounded-[2rem] border-2 border-[#E8C98B] bg-white shadow-[0_10px_30px_rgba(111,72,29,0.12)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(111,72,29,0.18)]"
                            >
                                <div className="relative shrink-0 bg-[radial-gradient(circle_at_50%_35%,#FFF1B8,transparent_55%),#FFF8E7]">
                                    {gift.imageUrl ? (
                                        <img
                                            src={gift.imageUrl}
                                            alt={gift.name}
                                            className="h-56 w-full object-contain p-5 transition duration-200 group-hover:scale-[1.03]"
                                        />
                                    ) : (
                                        <div className="flex h-56 w-full items-center justify-center">
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

                                <div className="flex min-h-[250px] flex-1 flex-col p-5">
                                    <h3 className="line-clamp-2 min-h-[3.75rem] text-2xl font-black leading-tight text-[#3B2412]">
                                        {gift.name}
                                    </h3>

                                    <div className="mt-2 min-h-6">
                                        {gift.brand ? (
                                            <p className="text-base font-bold text-[#7A5631]">
                                                {gift.brand}
                                            </p>
                                        ) : null}
                                    </div>

                                    <div className="mt-4 min-h-9">
                                        {gift.price ? (
                                            <p className="text-2xl font-black text-[#5A371C]">
                                                {gift.currency} {gift.price}
                                            </p>
                                        ) : null}
                                    </div>

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

                                    <div className="mt-auto pt-4">
                                        {(gift.color || gift.size || gift.dimensions) ? (
                                            <div className="flex min-h-[58px] flex-wrap content-start gap-2">
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
                                        ) : (
                                            <div className="min-h-[58px]" />
                                        )}
                                    </div>
                                </div>

                                <div className="grid min-h-[132px] shrink-0 content-center gap-3 border-t-2 border-[#F1D7A5] bg-[#FFF8E7] p-5">
                                    {gift.status === "PURCHASED" ? (
                                        <div className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#EFFFF7] px-6 text-sm font-black text-[#2F6B4F]">
                                            <Check className="mr-2 size-5" />
                                            Regalo completado
                                        </div>
                                    ) : (
                                        <>
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
                                                quantity={gift.quantity}
                                                purchasedQuantity={gift.purchasedQuantity}
                                            />
                                        </>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>

                    {showPagination ? (
                        <StoryPagination
                            className="mt-8"
                            currentPage={validCurrentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            totalItems={filteredGifts.length}
                            pageSize={pageSize}
                            onPageSizeChange={handlePageSizeChange}
                            itemLabel="regalos"
                        />
                    ) : null}
                </>
            )}
        </div>
    );
}