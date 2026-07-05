import Link from "next/link";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth-session";
import { EVENT_TYPE_LABELS } from "@/features/events/lib/event-labels";
import { getEventByIdForCreator } from "@/features/events/services/event-service";
import { CreateGiftDialog } from "@/features/gifts/components/create-gift-dialog";
import { ShareEventDialog } from "@/features/events/components/share-event-dialog";
import { EditEventDialog } from "@/features/events/components/edit-event-dialog";
import { DeleteEventButton } from "@/features/events/components/delete-event-button";
import { SortableGiftList } from "@/features/gifts/components/sortable-gift-list";
import { SortGiftsButtons } from "@/features/gifts/components/sort-gifts-buttons";

import { Gift, Heart, Share2, Settings, Sparkles, CalendarDays, MapPin } from "lucide-react";

import { StoryBadge } from "@/components/storybook/story-badge";
import { StoryCard } from "@/components/storybook/story-card";
import { StoryLinkButton } from "@/components/storybook/story-button";

type EventDetailPageProps = {
    params: Promise<{
        eventId: string;
    }>;
};

function giftToViewModel(gift: {
    id: string;
    eventId: string;
    name: string;
    imageUrl: string | null;
    brand: string | null;
    price: { toString(): string } | null;
    currency: string;
    description: string | null;
    color: string | null;
    size: string | null;
    dimensions: string | null;
    originalUrl: string | null;
    status: "AVAILABLE" | "PURCHASED";
    quantity: number;
    purchasedQuantity: number;
}) {
    return {
        id: gift.id,
        eventId: gift.eventId,
        name: gift.name,
        imageUrl: gift.imageUrl,
        brand: gift.brand,
        price: gift.price ? gift.price.toString() : null,
        currency: gift.currency,
        description: gift.description,
        color: gift.color,
        size: gift.size,
        dimensions: gift.dimensions,
        originalUrl: gift.originalUrl,
        status: gift.status,
        quantity: gift.quantity,
        purchasedQuantity: gift.purchasedQuantity,
    };
}

function getDaysUntil(date: Date) {
    const today = new Date();
    const eventDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    return Math.ceil(
        (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
    const { eventId } = await params;
    const user = await requireUser();

    const event = await getEventByIdForCreator(eventId, user.id);

    if (!event) {
        notFound();
    }

    const gifts = event.gifts.map(giftToViewModel);
    const availableGifts = gifts.filter((gift) => gift.status === "AVAILABLE");
    const purchasedGifts = gifts.filter((gift) => gift.status === "PURCHASED");
    const daysUntilEvent = getDaysUntil(event.date);

    return (
        <div className="space-y-8">
            <div>
                <StoryLinkButton href="/dashboard" variant="cream">
                    ← Volver a eventos
                </StoryLinkButton>
            </div>

            <StoryCard className="relative overflow-hidden p-8 md:p-12">
                <div className="absolute -right-14 -top-14 size-48 rounded-full bg-[#FFD8A8]" />
                <div className="absolute bottom-8 right-36 size-32 rounded-full bg-[#BFE8D5]" />
                <div className="absolute -bottom-16 left-1/2 size-48 rounded-full bg-[#FFE38A]" />

                <div className="relative grid gap-8 xl:grid-cols-[1fr_300px] xl:items-end">
                    <div>
                        <StoryBadge>{EVENT_TYPE_LABELS[event.type]}</StoryBadge>

                        <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[0.95] tracking-tight text-[#3E260E] sm:text-5xl md:text-6xl">
                            {event.name}
                        </h1>

                        <p className="mt-5 max-w-2xl text-xl font-bold leading-8 text-[#7A4E28]">
                            Una lista de regalos preparada con cariño para {event.honoreeName}.
                        </p>

                        {event.description ? (
                            <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-[#8A6332]">
                                {event.description}
                            </p>
                        ) : null}

                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-[1.75rem] bg-[#FFF8E7] p-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-12 items-center justify-center rounded-2xl bg-[#FFE9AA]">
                                        <CalendarDays className="size-6 text-[#B97A22]" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wide text-[#A47A42]">
                                            Fecha
                                        </p>
                                        <p className="text-lg font-bold text-[#3E260E]">
                                            {event.date.toLocaleDateString("es-PE")}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[1.75rem] bg-[#FFF8E7] p-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-12 items-center justify-center rounded-2xl bg-[#FFE9AA]">
                                        <MapPin className="size-6 text-[#B97A22]" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wide text-[#A47A42]">
                                            Lugar
                                        </p>
                                        <p className="text-lg font-bold text-[#3E260E]">
                                            {event.location}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[2rem] bg-[#FFF8E7] p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#FFE9AA]">
                                <Sparkles className="size-6 text-[#B97A22]" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#8A6332]">Resumen</p>
                                <p className="text-xl font-bold text-[#3E260E]">Lista activa</p>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                            <div className="rounded-2xl bg-white p-3">
                                <p className="text-2xl font-bold text-[#3E260E]">{gifts.length}</p>
                                <p className="text-xs font-bold text-[#8A6332]">Regalos</p>
                            </div>

                            <div className="rounded-2xl bg-[#EFFFF7] p-3">
                                <p className="text-2xl font-bold text-[#2F6B4F]">
                                    {availableGifts.length}
                                </p>
                                <p className="text-xs font-bold text-[#4B8067]">Disponibles</p>
                            </div>

                            <div className="rounded-2xl bg-[#FFF0F4] p-3">
                                <p className="text-2xl font-bold text-[#9A4660]">
                                    {purchasedGifts.length}
                                </p>
                                <p className="text-xs font-bold text-[#9A4660]">Comprados</p>
                            </div>
                        </div>

                        <div className="mt-6 rounded-[2rem] bg-[#FFE9AA] p-5 text-center shadow-[inset_0_-4px_0_rgba(185,122,34,0.18)]">
                            <p className="text-sm font-black uppercase tracking-wide text-[#8A6332]">
                                Faltan
                            </p>

                            <p className="mt-1 text-6xl font-black leading-none text-[#3E260E]">
                                {daysUntilEvent > 0 ? daysUntilEvent : 0}
                            </p>

                            <p className="mt-1 text-lg font-black text-[#7A4E28]">
                                {daysUntilEvent === 1
                                    ? "día para celebrar"
                                    : daysUntilEvent <= 0
                                        ? "¡es hoy!"
                                        : "días para celebrar"}
                            </p>
                        </div>
                    </div>
                </div>
            </StoryCard>

            <section className="grid gap-6 md:grid-cols-2">
                <StoryCard className="p-8">
                    <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#FFE9AA]">
                        <Share2 className="size-6 text-[#B97A22]" />
                    </div>

                    <h2 className="text-3xl font-bold text-[#3E260E]">Compartir</h2>

                    <p className="mt-3 text-base font-semibold leading-7 text-[#7A4E28]">
                        Envía el enlace o QR de la lista a tus invitados.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <ShareEventDialog slug={event.slug} />

                        <StoryLinkButton
                            href={`/evento/${event.slug}`}
                            target="_blank"
                            variant="cream"
                        >
                            Ver público
                        </StoryLinkButton>
                    </div>
                </StoryCard>

                <StoryCard className="p-8">
                    <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#FFE9AA]">
                        <Settings className="size-6 text-[#B97A22]" />
                    </div>

                    <h2 className="text-3xl font-bold text-[#3E260E]">Configuración</h2>

                    <p className="mt-3 text-base font-semibold leading-7 text-[#7A4E28]">
                        Edita la información principal del evento o elimínalo si ya no lo
                        necesitas.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <EditEventDialog
                            event={{
                                id: event.id,
                                type: event.type,
                                name: event.name,
                                honoreeName: event.honoreeName,
                                date: event.date.toISOString().slice(0, 10),
                                location: event.location,
                                description: event.description ?? "",
                            }}
                        />

                        <DeleteEventButton eventId={event.id} />
                    </div>
                </StoryCard>
            </section>

            <StoryCard className="p-6 md:p-8">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#B97A22]">
                            <Gift className="size-4" />
                            Regalos
                        </div>

                        <h2 className="text-4xl font-bold tracking-tight text-[#3E260E]">
                            Lista de regalos
                        </h2>

                        <p className="mt-2 max-w-xl text-base font-semibold leading-7 text-[#7A4E28]">
                            Agrega, edita y ordena los regalos que verán tus invitados.
                        </p>
                    </div>

                    <CreateGiftDialog eventId={event.id} />
                </div>

                {event.gifts.length > 1 ? (
                    <div className="mt-6 rounded-[1.75rem] bg-[#FFF8E7] p-4">
                        <SortGiftsButtons
                            eventId={event.id}
                            gifts={event.gifts.map((gift) => ({
                                id: gift.id,
                                name: gift.name,
                                priceNumber: gift.price ? Number(gift.price.toString()) : null,
                            }))}
                        />
                    </div>
                ) : null}

                {gifts.length === 0 ? (
                    <div className="mt-8 rounded-[2rem] border-2 border-dashed border-[#E8C78A] bg-[#FFF8E7] p-10 text-center">
                        <h3 className="text-2xl font-bold text-[#3E260E]">
                            Todavía no hay regalos
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-base font-semibold leading-7 text-[#7A4E28]">
                            Agrega el primer regalo para comenzar a construir la lista.
                        </p>
                    </div>
                ) : (
                    <div className="mt-8">
                        <SortableGiftList eventId={event.id} gifts={gifts} />
                    </div>
                )}
            </StoryCard>
        </div>
    );
}