"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { createEventAction } from "@/features/events/actions/create-event-action";
import {
    eventSchema,
    type EventInput,
} from "@/features/events/schemas/event-schema";

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

export function CreateEventDialog() {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<EventInput>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            type: "BIRTHDAY",
            name: "",
            honoreeName: "",
            date: "",
            location: "",
            description: "",
        },
    });

    function onSubmit(values: EventInput) {
        startTransition(async () => {
            const result = await createEventAction(values);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            form.reset();
            setOpen(false);
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[#F8C63D] px-6 text-sm font-black text-[#3E260E] shadow-[0_5px_0_#B97A22] transition hover:-translate-y-0.5 hover:bg-[#FFD85F]"
                >
                    Crear evento
                </button>
            </DialogTrigger>

            <DialogContent className="rounded-[2rem] border-2 border-[#E8C78A] bg-[#FFFDF7] p-6 shadow-[0_24px_70px_rgba(101,67,33,0.22)]" onOpenAutoFocus={(e) => { e.preventDefault(); }}>
                <DialogHeader>
                    <DialogTitle>Crear evento</DialogTitle>
                    <DialogDescription>
                        Crea una lista de regalos para compartir con tus invitados.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de evento</FormLabel>
                                    <FormControl>
                                        <select
                                            className="h-12 w-full appearance-none rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 text-sm font-bold text-[#4A2D16]"
                                            {...field}
                                        >
                                            <option value="BABY_SHOWER">Baby Shower</option>
                                            <option value="BIRTHDAY">Cumpleaños</option>
                                            <option value="WEDDING">Matrimonio</option>
                                            <option value="BAPTISM">Bautizo</option>
                                            <option value="GRADUATION">Graduación</option>
                                            <option value="CHRISTMAS">Navidad</option>
                                            <option value="OTHER">Otro</option>
                                        </select>
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
                                    <FormLabel>Nombre del evento</FormLabel>
                                    <FormControl>
                                        <Input className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]" placeholder="Baby Shower de Mateo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="honoreeName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Homenajeado</FormLabel>
                                    <FormControl>
                                        <Input className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]" placeholder="Mateo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha</FormLabel>
                                    <FormControl>
                                        <Input className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]" type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lugar</FormLabel>
                                    <FormControl>
                                        <Input className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]" placeholder="Casa, salón, restaurante..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="locationURL"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ubicación en el mapa</FormLabel>
                                    <FormControl>
                                        <Input className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]" placeholder="https://www.google.com/maps..." {...field} />
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
                            {isPending ? "Creando..." : "Crear evento"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}