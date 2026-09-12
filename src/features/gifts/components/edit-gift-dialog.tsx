"use client";

import { useState, useTransition } from "react";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateGiftAction } from "@/features/gifts/actions/update-gift-action";
import { giftSchema, type GiftData } from "@/features/gifts/schemas/gift-schema";
import { fetchProductMetadataAction } from "@/features/gifts/actions/fetch-product-metadata-action";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type EditGiftDialogProps = {
    gift: {
        id: string;
        eventId: string;
        name: string;
        quantity: number;
        imageUrl: string | null;
        brand: string | null;
        price: string | null;
        currency: string;
        description: string | null;
        color: string | null;
        size: string | null;
        dimensions: string | null;
        originalUrl: string | null;
        status?: "AVAILABLE" | "PURCHASED";
        purchasedQuantity?: number;
    };
};

export function EditGiftDialog({ gift }: EditGiftDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isFetchingMetadata, startMetadataTransition] = useTransition();

    const form = useForm<GiftData>({
        resolver: zodResolver(giftSchema),
        defaultValues: {
            eventId: gift.eventId,
            name: gift.name,
            quantity: gift.quantity ?? 1,
            imageUrl: gift.imageUrl ?? "",
            brand: gift.brand ?? "",
            price: gift.price ?? "",
            currency: gift.currency ?? "PEN",
            description: gift.description ?? "",
            color: gift.color ?? "",
            size: gift.size ?? "",
            dimensions: gift.dimensions ?? "",
            originalUrl: gift.originalUrl ?? "",
        },
    });

    function onSubmit(values: GiftData) {
        startTransition(async () => {
            const result = await updateGiftAction(gift.id, values);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            setOpen(false);
        });
    }

    function handleFetchMetadata() {
        const originalUrl = form.getValues("originalUrl");

        if (!originalUrl) {
            toast.error("Ingresa un link primero.");
            return;
        }

        startMetadataTransition(async () => {
            const result = await fetchProductMetadataAction(originalUrl);

            if (!result.success || !result.data) {
                toast.error(result.message);
                return;
            }

            form.setValue("originalUrl", result.data.originalUrl);

            if (result.data.name) form.setValue("name", result.data.name);
            if (result.data.imageUrl) form.setValue("imageUrl", result.data.imageUrl);
            if (result.data.brand) form.setValue("brand", result.data.brand);
            if (result.data.price) form.setValue("price", result.data.price);
            if (result.data.currency) form.setValue("currency", result.data.currency);

            toast.success("Datos autocompletados.");
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-4 text-sm font-black text-[#5A371C] transition hover:bg-[#FFEFC4]"
                >
                    <Pencil className="size-4" />
                </button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[2rem] border-2 border-[#E8C78A] bg-[#FFFDF7] p-6 shadow-[0_24px_70px_rgba(101,67,33,0.22)]">
                <DialogHeader>
                    <DialogTitle>Editar regalo</DialogTitle>
                    <DialogDescription>
                        Actualiza la información del regalo.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <Input className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]" type="hidden" {...form.register("eventId")} />
                        
                        <FormField
                            control={form.control}
                            name="originalUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Link original</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-2">
                                            <Input className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]" placeholder="https://tienda.com/producto" {...field} />

                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={isFetchingMetadata}
                                                onClick={handleFetchMetadata}
                                            >
                                                {isFetchingMetadata ? "Leyendo..." : "Importar"}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]" placeholder="Coche, cuna, juguete..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <input type="hidden" {...form.register("eventId")} />

                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cantidad requerida</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={1}
                                            className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]"
                                            value={field.value}
                                            onChange={(event) => field.onChange(event.target.valueAsNumber)}
                                            onBlur={field.onBlur}
                                            name={field.name}
                                            ref={field.ref}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Imagen URL</FormLabel>
                                    <FormControl>
                                        <Input className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]" placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="brand"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Marca</FormLabel>
                                        <FormControl>
                                            <Input className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]" placeholder="Opcional" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Precio</FormLabel>
                                        <FormControl>
                                            <Input className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]" placeholder="99.90" inputMode="decimal" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Moneda</FormLabel>
                                        <FormControl>
                                            <Input className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]" placeholder="PEN" maxLength={3} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Color</FormLabel>
                                        <FormControl>
                                            <Input className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]" placeholder="Opcional" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="size"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Talla</FormLabel>
                                        <FormControl>
                                            <Input className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]" placeholder="Opcional" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="dimensions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Medidas</FormLabel>
                                    <FormControl>
                                        <Input className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]" placeholder="Opcional" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="h-12 w-full rounded-full bg-[#F8C63D] text-sm font-black text-[#3E260E] shadow-[0_5px_0_#B97A22] hover:bg-[#FFD85F]"
                            disabled={isPending}
                        >
                            {isPending ? "Guardando..." : "Guardar cambios"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}