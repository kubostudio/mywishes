"use client";

import { useState, useTransition } from "react";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateEventAction } from "@/features/events/actions/update-event-action";
import {
    eventFormSchema,
    type EventFormInput,
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

type EditEventDialogProps = {
    event: {
        id: string;
        type: EventInput["type"];
        name: string;
        honoreeName?: string;
        gender?: "MALE" | "FEMALE";
        birthdayAge?: number;
        dressCode?: string;
        date: string;
        endDate?: string;
        timezone?: string;
        location: string;
        locationURL: string;
        description?: string;
    };
};

function toDateTimeLocal(isoDate?: string) {
    if (!isoDate) {
        return "";
    }

    const date = new Date(isoDate);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60_000);

    return localDate.toISOString().slice(0, 16);
}

export function EditEventDialog({ event }: EditEventDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<EventFormInput>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            type: event.type,
            name: event.name,
            honoreeName: event.honoreeName,
            gender: event.gender,
            birthdayAge: event.birthdayAge,
            dressCode: event.dressCode ?? "",
            date: toDateTimeLocal(event.date),
            endDate: toDateTimeLocal(event.endDate),
            location: event.location,
            locationURL: event.locationURL,
            description: event.description ?? "",
        },
    });

    const eventType = form.watch("type");

    const showGender = eventType !== "GENDER_REVEAL" && eventType !== "CHRISTMAS";
    const showBirthdayAge = eventType === "BIRTHDAY";
    const showHonoreeName = eventType !== "GENDER_REVEAL";

    function onSubmit(values: EventFormInput) {
        startTransition(async () => {
            const browserTimezone =
                Intl.DateTimeFormat().resolvedOptions().timeZone;

            const payload: EventInput = {
                ...values,
                date: new Date(values.date).toISOString(),
                endDate: values.endDate
                    ? new Date(values.endDate).toISOString()
                    : undefined,
                timezone: browserTimezone,
            };

            const result = await updateEventAction(event.id, payload);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            setOpen(false);
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-6 text-sm font-black text-[#5A371C] transition hover:bg-[#FFEFC4]"
                >
                    <Pencil className="size-4" />
                    Editar
                </button>
            </DialogTrigger>

            <DialogContent
                className="
                    flex
                    h-[90dvh]
                    w-[calc(100vw-2rem)]
                    max-w-[calc(100vw-2rem)]
                    flex-col
                    overflow-hidden
                    rounded-[2rem]
                    border-2 border-[#E8C78A]
                    bg-[#FFFDF7]
                    p-0
                    shadow-[0_24px_70px_rgba(101,67,33,0.22)]
                    sm:h-auto
                    sm:max-h-[90vh]
                    sm:max-w-2xl
                "
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader className="shrink-0 border-b border-[#E8C78A]/60 px-6 py-5">
                    <DialogTitle>Editar evento</DialogTitle>

                    <DialogDescription>
                        Actualiza la información principal de tu evento.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex min-h-0 flex-1 flex-col overflow-hidden"
                    >
                        {/* Área que hace scroll */}
                        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5">
                            <div className="space-y-6">

                                {/* Información principal */}
                                <div className="space-y-3">
                                    <p className="text-xs font-black uppercase tracking-wider text-[#B97A22]">
                                        Información del evento
                                    </p>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Tipo de evento
                                                    </FormLabel>

                                                    <FormControl>
                                                        <select
                                                            className="h-12 w-full rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 text-sm font-bold text-[#4A2D16]"
                                                            {...field}
                                                        >
                                                            <option value="GENDER_REVEAL">
                                                                Gender Reveal
                                                            </option>

                                                            <option value="BABY_SHOWER">
                                                                Baby Shower
                                                            </option>

                                                            <option value="BIRTHDAY">
                                                                Cumpleaños
                                                            </option>

                                                            <option value="BAPTISM">
                                                                Bautizo
                                                            </option>

                                                            {/* <option value="WEDDING">
                                                                Matrimonio
                                                            </option> */}

                                                            <option value="CHRISTMAS">
                                                                Navidad
                                                            </option>

                                                            <option value="OTHER">
                                                                Otro
                                                            </option>
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
                                                    <FormLabel>
                                                        Nombre del evento
                                                    </FormLabel>

                                                    <FormControl>
                                                        <Input
                                                            className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]"
                                                            placeholder="Baby Shower de Mateo"
                                                            {...field}
                                                        />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {showHonoreeName && (
                                            <FormField
                                                control={form.control}
                                                name="honoreeName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Homenajeado
                                                        </FormLabel>

                                                        <FormControl>
                                                            <Input
                                                                className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]"
                                                                placeholder="Mateo"
                                                                value={
                                                                    field.value ??
                                                                    ""
                                                                }
                                                                onChange={
                                                                    field.onChange
                                                                }
                                                            />
                                                        </FormControl>

                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}

                                        {showGender && (
                                            <FormField
                                                control={form.control}
                                                name="gender"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Género
                                                        </FormLabel>

                                                        <FormControl>
                                                            <select
                                                                className="h-12 w-full rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 text-sm font-bold text-[#4A2D16]"
                                                                value={
                                                                    field.value ??
                                                                    ""
                                                                }
                                                                onChange={
                                                                    field.onChange
                                                                }
                                                            >
                                                                <option value="">
                                                                    Seleccionar
                                                                </option>

                                                                <option value="FEMALE">
                                                                    Femenino
                                                                </option>

                                                                <option value="MALE">
                                                                    Masculino
                                                                </option>
                                                            </select>
                                                        </FormControl>

                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}

                                        {showBirthdayAge && (
                                            <FormField
                                                control={form.control}
                                                name="birthdayAge"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            ¿Cuántos años
                                                            cumple?
                                                        </FormLabel>

                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                min={1}
                                                                className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]"
                                                                value={
                                                                    field.value ??
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        e.target
                                                                            .value
                                                                            ? Number(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                            : undefined
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>

                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}

                                        <FormField
                                            control={form.control}
                                            name="dressCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Dress code
                                                    </FormLabel>

                                                    <FormControl>
                                                        <Input
                                                            className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]"
                                                            placeholder="Ej. Formal, casual, vestir de blanco..."
                                                            {...field}
                                                        />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Fecha y hora */}
                                <div className="space-y-3">
                                    <p className="text-xs font-black uppercase tracking-wider text-[#B97A22]">
                                        Fecha y hora
                                    </p>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="date"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Fecha y hora de inicio
                                                    </FormLabel>

                                                    <FormControl>
                                                        <Input
                                                            type="datetime-local"
                                                            className="h-12 rounded-full appearance-none border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]"
                                                            {...field}
                                                        />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="endDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Fecha y hora de fin
                                                        (opcional)
                                                    </FormLabel>

                                                    <FormControl>
                                                        <Input
                                                            type="datetime-local"
                                                            className="h-12 rounded-full appearance-none border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]"
                                                            value={
                                                                field.value ?? ""
                                                            }
                                                            onChange={
                                                                field.onChange
                                                            }
                                                        />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Ubicación */}
                                <div className="space-y-3">
                                    <p className="text-xs font-black uppercase tracking-wider text-[#B97A22]">
                                        Ubicación
                                    </p>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="location"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Lugar
                                                    </FormLabel>

                                                    <FormControl>
                                                        <Input
                                                            className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]"
                                                            placeholder="Casa, salón, restaurante..."
                                                            {...field}
                                                        />
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
                                                    <FormLabel>
                                                        Ubicación en el mapa
                                                    </FormLabel>

                                                    <FormControl>
                                                        <Input
                                                            className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]"
                                                            placeholder="https://www.google.com/maps..."
                                                            {...field}
                                                        />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Descripción */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Descripción
                                            </FormLabel>

                                            <FormControl>
                                                <Input
                                                    className="h-12 rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] px-5 font-bold text-[#4A2D16]"
                                                    placeholder="Cuéntales un poco sobre el evento..."
                                                    value={field.value ?? ""}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/*
                                    Padding extra para que el último campo
                                    respire antes del footer.
                                */}
                                <div className="h-1" />
                            </div>
                        </div>

                        {/* Footer fijo: NO hace scroll */}
                        <div className="shrink-0 border-t border-[#E8C78A]/60 bg-[#FFFDF7] px-6 py-4">
                            <Button
                                type="submit"
                                className="h-12 w-full rounded-full bg-[#F8C63D] text-sm font-black text-[#3E260E] shadow-[0_5px_0_#B97A22] hover:bg-[#FFD85F]"
                                disabled={isPending}
                            >
                                {isPending
                                    ? "Guardando..."
                                    : "Guardar cambios"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}