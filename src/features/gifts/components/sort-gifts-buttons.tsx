"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { reorderGiftsAction } from "@/features/gifts/actions/reorder-gifts-action";

type GiftForSort = {
    id: string;
    name: string;
    priceNumber: number | null;
};

type SortGiftsButtonsProps = {
    eventId: string;
    gifts: GiftForSort[];
};

export function SortGiftsButtons({ eventId, gifts }: SortGiftsButtonsProps) {
    const [isPending, startTransition] = useTransition();

    function applySort(sortType: "AZ" | "ZA" | "PRICE_ASC" | "PRICE_DESC") {
        const sorted = [...gifts];

        if (sortType === "AZ") {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        }

        if (sortType === "ZA") {
            sorted.sort((a, b) => b.name.localeCompare(a.name));
        }

        if (sortType === "PRICE_ASC") {
            sorted.sort(
                (a, b) => (a.priceNumber ?? Infinity) - (b.priceNumber ?? Infinity)
            );
        }

        if (sortType === "PRICE_DESC") {
            sorted.sort(
                (a, b) => (b.priceNumber ?? -Infinity) - (a.priceNumber ?? -Infinity)
            );
        }

        startTransition(async () => {
            const result = await reorderGiftsAction(
                eventId,
                sorted.map((gift) => gift.id)
            );

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success("Orden actualizado.");
        });
    }

    return (
        <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm md:w-auto"
            disabled={isPending}
            defaultValue=""
            onChange={(event) => {
                const value = event.target.value;

                if (!value) return;

                applySort(value as "AZ" | "ZA" | "PRICE_ASC" | "PRICE_DESC");
                event.target.value = "";
            }}
        >
            <option value="" disabled>
                Ordenar regalos
            </option>
            <option value="AZ">Alfabético A-Z</option>
            <option value="ZA">Alfabético Z-A</option>
            <option value="PRICE_ASC">Precio menor a mayor</option>
            <option value="PRICE_DESC">Precio mayor a menor</option>
        </select>
    );
}