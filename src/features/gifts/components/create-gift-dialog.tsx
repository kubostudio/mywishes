"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { createGiftAction } from "@/features/gifts/actions/create-gift-action";
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

type CreateGiftDialogProps = {
    eventId: string;
};

export function CreateGiftDialog({ eventId }: CreateGiftDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isFetchingMetadata, startMetadataTransition] = useTransition();

    const form = useForm<GiftData>({
        resolver: zodResolver(giftSchema),
        defaultValues: {
            eventId,
            name: "",
            quantity: 1,
            imageUrl: "",
            brand: "",
            price: "",
            currency: "PEN",
            description: "",
            color: "",
            size: "",
            dimensions: "",
            originalUrl: "",
        },
    });

    function onSubmit(values: GiftData) {
        startTransition(async () => {
            const result = await createGiftAction(values);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            form.reset({
                eventId,
                name: "",
                quantity: 1,
                imageUrl: "",
                brand: "",
                price: "",
                currency: "PEN",
                description: "",
                color: "",
                size: "",
                dimensions: "",
                originalUrl: "",
            });
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

            if (result.data.name) {
                form.setValue("name", result.data.name);
            }

            if (result.data.imageUrl) {
                form.setValue("imageUrl", result.data.imageUrl);
            }

            if (result.data.brand) {
                form.setValue("brand", result.data.brand);
            }

            if (result.data.price) {
                form.setValue("price", result.data.price);
            }

            if (result.data.currency) {
                form.setValue("currency", result.data.currency);
            }

            toast.success("Datos autocompletados.");
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[#F8C63D] px-6 text-sm font-black text-[#3E260E] shadow-[0_5px_0_#B97A22] transition hover:-translate-y-0.5 hover:bg-[#FFD85F]"
                >
                    Agregar regalo
                </button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[2rem] border-2 border-[#E8C78A] bg-[#FFFDF7] p-6 shadow-[0_24px_70px_rgba(101,67,33,0.22)]">
                <DialogHeader>
                    <DialogTitle>Agregar regalo</DialogTitle>
                    <DialogDescription>
                        Agrega manualmente un regalo a esta lista.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <Input className="honey-input" type="hidden" {...form.register("eventId")} />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input className="honey-input" placeholder="Coche, cuna, juguete..." {...field} />
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
                            name="originalUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Link original</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-2">
                                            <Input className="honey-input" placeholder="https://tienda.com/producto" {...field} />

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
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Imagen URL</FormLabel>
                                    <FormControl>
                                        <Input className="honey-input" placeholder="https://..." {...field} />
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
                                            <Input className="honey-input" placeholder="Opcional" {...field} />
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
                                            <Input className="honey-input" placeholder="99.90" inputMode="decimal" {...field} />
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
                                            <Input className="honey-input" placeholder="PEN" maxLength={3} {...field} />
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
                                            <Input className="honey-input" placeholder="Opcional" {...field} />
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
                                            <Input className="honey-input" placeholder="Opcional" {...field} />
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
                                        <Input className="honey-input" placeholder="Opcional" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="honey-button w-full" disabled={isPending}>
                            {isPending ? "Agregando..." : "Agregar regalo"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}