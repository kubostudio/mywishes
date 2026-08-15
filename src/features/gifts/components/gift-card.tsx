"use client";

import { useState, useTransition } from "react";
import {
    ExternalLink,
    GiftIcon,
    RotateCcw,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { setGiftAvailableQuantityAction } from "@/features/gifts/actions/set-gift-available-quantity-action";

import { deleteGiftAction } from "@/features/gifts/actions/delete-gift-action";
import { EditGiftDialog } from "@/features/gifts/components/edit-gift-dialog";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type GiftCardProps = {
    gift: {
        id: string;
        eventId: string;
        name: string;
        imageUrl: string | null;
        brand: string | null;
        price: string | null;
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
};

export function GiftCard({ gift }: GiftCardProps) {
    const [isPending, startTransition] = useTransition();
    const price = gift.price ? `${gift.currency} ${gift.price}` : null;
    const currentAvailableQuantity =
        gift.quantity - gift.purchasedQuantity;
    const [availableQuantity, setAvailableQuantity] = useState(
        Math.max(currentAvailableQuantity, 1)
    );
    const [availabilityDialogOpen, setAvailabilityDialogOpen] =
        useState(false);

    function handleDelete() {
        startTransition(async () => {
            const result = await deleteGiftAction(gift.id);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
        });
    }

    function handleSetAvailableQuantity() {
        if (
            availableQuantity < 1 ||
            availableQuantity > gift.quantity
        ) {
            toast.error("Ingresa una cantidad disponible válida.");
            return;
        }

        startTransition(async () => {
            const result = await setGiftAvailableQuantityAction(
                gift.id,
                gift.eventId,
                gift.quantity === 1 ? 1 : availableQuantity
            );

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            setAvailabilityDialogOpen(false);
        });
    }

    return (
        <article className="group overflow-hidden rounded-[2rem] border-2 border-[#E8C78A] bg-[#FFFDF7] shadow-[0_14px_36px_rgba(101,67,33,0.12)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(101,67,33,0.18)]">
            <div className="relative bg-[#FFF8E7]">
                {gift.imageUrl ? (
                    <img
                        src={gift.imageUrl}
                        alt={gift.name}
                        className="aspect-square w-full object-contain p-6 transition duration-200 group-hover:scale-[1.03]"
                    />
                ) : (
                    <div className="flex aspect-square w-full items-center justify-center">
                        <GiftIcon className="size-16 text-[#C78A21]" />
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
                <h3 className="line-clamp-2 text-2xl font-black leading-tight text-[#3E260E]">
                    {gift.name}
                </h3>

                {gift.brand ? (
                    <p className="mt-2 text-base font-bold text-[#7A4E28]">
                        {gift.brand}
                    </p>
                ) : null}

                {price ? (
                    <p className="mt-4 text-2xl font-black text-[#5A371C]">{price}</p>
                ) : null}

                {gift.quantity > 1 ? (
                    <div className="mt-3 rounded-full bg-[#FFF1B8] px-4 py-2 text-sm font-black text-[#5A371C]">
                        Comprados {gift.purchasedQuantity} de {gift.quantity}
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

            <div className="grid gap-3 border-t-2 border-[#F1D7A5] bg-[#FFF8E7] p-4">
                {gift.originalUrl ? (
                    <a
                        href={gift.originalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 items-center justify-center rounded-full border-2 border-[#E8C78A] bg-white px-4 text-sm font-black text-[#5A371C] transition hover:bg-[#FFF1C9]"
                    >
                        Ver en tienda
                        <ExternalLink className="ml-2 size-4" />
                    </a>
                ) : null}

                {gift.purchasedQuantity > 0 ? (
                    <AlertDialog
                        open={availabilityDialogOpen}
                        onOpenChange={(open) => {
                            setAvailabilityDialogOpen(open);

                            if (open) {
                                setAvailableQuantity(
                                    Math.max(currentAvailableQuantity, 1)
                                );
                            }
                        }}
                    >
                        <AlertDialogTrigger asChild>
                            <button
                                type="button"
                                disabled={isPending}
                                className="inline-flex h-11 items-center justify-center rounded-full border-2 border-[#BFE8D5] bg-[#EFFFF7] px-4 text-sm font-black text-[#2F6B4F] transition hover:bg-[#DDF8EA] disabled:opacity-60"
                            >
                                <RotateCcw className="mr-2 size-4" />

                                {gift.quantity > 1
                                    ? "Cambiar disponibilidad"
                                    : "Marcar disponible"}
                            </button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="rounded-[2rem] border-2 border-[#E8C78A] bg-[#FFFDF7] p-6 shadow-[0_24px_70px_rgba(101,67,33,0.22)]">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl font-black text-[#3E260E]">
                                    {gift.quantity > 1
                                        ? "Cambiar disponibilidad"
                                        : "¿Volver a poner este regalo disponible?"}
                                </AlertDialogTitle>

                                <AlertDialogDescription className="text-base font-semibold leading-7 text-[#7A4E28]">
                                    {gift.quantity > 1
                                        ? `Este regalo tiene ${gift.quantity} unidades. Actualmente hay ${currentAvailableQuantity} disponibles.`
                                        : "El regalo volverá a estar disponible para tus invitados."}
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            {gift.quantity > 1 ? (
                                <div className="space-y-2">
                                    <label
                                        htmlFor={`available-${gift.id}`}
                                        className="text-sm font-black text-[#5A371C]"
                                    >
                                        ¿Cuántas unidades quieres dejar disponibles?
                                    </label>

                                    <input
                                        id={`available-${gift.id}`}
                                        type="number"
                                        min={1}
                                        max={gift.quantity}
                                        value={availableQuantity}
                                        onChange={(event) =>
                                            setAvailableQuantity(
                                                Number(event.target.value)
                                            )
                                        }
                                        className="h-12 w-full rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]"
                                    />
                                </div>
                            ) : null}

                            <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-full border-2 border-[#E8C78A] bg-white font-black text-[#5A371C] hover:bg-[#FFF1C9]">
                                    Cancelar
                                </AlertDialogCancel>

                                <AlertDialogAction
                                    onClick={handleSetAvailableQuantity}
                                    disabled={isPending}
                                    className="rounded-full bg-[#2F6B4F] font-black text-white hover:bg-[#3D8062]"
                                >
                                    {isPending ? "Actualizando..." : "Actualizar"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                ) : null}

                <div className="grid grid-cols-2 gap-3">
                    <EditGiftDialog gift={gift} />

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button
                                type="button"
                                disabled={isPending}
                                className="inline-flex h-11 items-center justify-center rounded-full bg-[#EF6A5B] px-4 text-sm font-black text-white shadow-[0_4px_0_#B94439] transition hover:-translate-y-0.5 disabled:opacity-60"
                            >
                                <Trash2 className="mr-2 size-4" />
                                Eliminar
                            </button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="rounded-[2rem] border-2 border-[#E8C78A] bg-[#FFFDF7] p-6 shadow-[0_24px_70px_rgba(101,67,33,0.22)]">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl font-black text-[#3E260E]">
                                    ¿Eliminar regalo?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-base font-semibold leading-7 text-[#7A4E28]">
                                    El regalo dejará de aparecer en la lista, pero no se eliminará
                                    físicamente de la base de datos.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-full border-2 border-[#E8C78A] bg-white font-black text-[#5A371C] hover:bg-[#FFF1C9]">
                                    Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="rounded-full bg-[#EF6A5B] font-black text-white hover:bg-[#F47C70]"
                                >
                                    Eliminar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </article>
    );
}