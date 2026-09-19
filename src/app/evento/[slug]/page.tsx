import { notFound } from "next/navigation";
import {
    CalendarDays,
    MapPin,
    Cake,
    Shirt,
    MessageSquareHeart,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { EVENT_TYPE_LABELS } from "@/features/events/lib/event-labels";
import { getPublicEventBySlug } from "@/features/public-event/services/public-event-service";
import { getApprovedMessagesCountByEventSlug } from "@/features/messages/services/message-service";
import { PublicGiftList } from "@/features/public-event/components/public-gift-list";
import type { Metadata } from "next";
import Link from "next/link";
import { EventDateTime } from "@/features/events/components/event-date-time";
import { CountdownLabel } from "@/features/public-event/components/countdown-label";
import { ForestDecor } from "@/components/storybook/story-decor";
import { AlldrickBabyShowerDecor } from "@/features/events/components/alldrick-baby-shower-decor"
import { PendingPurchasePrompt } from "@/features/public-event/components/pending-purchase-prompt";
import { getSafeExternalUrl } from "@/lib/sanitization";
import { Pooh } from "@/components/storybook/decorations/pooh";

type PublicEventPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({
    params,
}: PublicEventPageProps): Promise<Metadata> {
    const { slug } = await params;
    const event = await getPublicEventBySlug(slug);

    if (!event) {
        return {
            title: "Evento no encontrado",
        };
    }

    return {
        title: `${event.name} | WishList`,
        description: `Lista de regalos para ${event.honoreeName}.`,
    };
}

export default async function PublicEventPage({ params }: PublicEventPageProps) {
    const { slug } = await params;
    const event = await getPublicEventBySlug(slug);

    if (!event) {
        notFound();
    }

    const isAlldrickBabyShower = slug === "baby-shower-de-alldrick-gutierrez";
    const messagesCount = await getApprovedMessagesCountByEventSlug(slug);

    return (
        
        < main className = {`relative min-h-screen overflow-hidden ${isAlldrickBabyShower
                ? "bg-[linear-gradient(180deg,#ffc730,#ffc730)]"
                : "bg-[linear-gradient(180deg,#FFF8E8,#FFEFC4)]"
                }`}
        >
            {isAlldrickBabyShower ? (
                <AlldrickBabyShowerDecor />
            ) : (
                <ForestDecor sections={6} />
            )}
            <section className={`relative overflow-hidden border-b-2 border-[#ffc730] ${isAlldrickBabyShower
                        ? "rounded-b-[3vw] bg-[#b12315]"
                        : "border-[#F1D7A5] bg-[#FFF8E8]"
                        }`}
                        >
                <div 
                    className={`absolute -left-20 top-10 size-72 rounded-full bg-[#ffe28a29]/70 blur-3xl ${isAlldrickBabyShower
                        ? "bg-[#ffe28a29]"
                        : "bg-[#FFF8E8]"
                        }`}
                />
                <div
                    className={`absolute right-0 top-16 size-80 rounded-full bg-[#ffe28a29]/70 blur-3xl ${isAlldrickBabyShower
                        ? "bg-[#ffe28a29]"
                        : "bg-[#FFF8E8]"
                        }`}
                />
                <div
                    className={`absolute bottom-0 left-1/2 size-72 rounded-full bg-[#ffe28a29]/70 blur-3xl ${isAlldrickBabyShower
                        ? "bg-[#ffe28a29]"
                        : "bg-[#FFF8E8]"
                        }`}
                />
                
                {isAlldrickBabyShower && (
                    <>
                        <Pooh
                            className="right-[7%] top-[22%] h-20 w-20 animate-honeycomb opacity-38 [--rotate:8deg]"
                        />
                        <Pooh
                            className="left-[4%] top-[20%] h-20 w-20 animate-honeycomb opacity-38 [--rotate:-20deg]"
                        />
                    </>
                )}


                <div className="relative mx-auto max-w-5xl px-4 py-14 md:py-20">
                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-12">
                        <div className="col-span-1 sm:col-span-7">
                            <Badge className="rounded-full bg-[#FFE9AA] px-4 py-2 text-sm font-extrabold text-[#5A371C]">
                                {EVENT_TYPE_LABELS[event.type]}
                            </Badge>

                            <h1
                                className={`mt-6 max-w-3xl text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl md:text-7xl ${isAlldrickBabyShower
                                        ? "text-[#F5DEB3]"
                                        : "text-[#3B2412]"
                                    }`}
                            >
                                {event.name}
                            </h1>

                            {event.type === "GENDER_REVEAL" ? (
                                <p className={`mt-6 max-w-2xl text-xl font-bold leading-8 ${isAlldrickBabyShower
                                        ? "text-[#F5DEB3]"
                                        : "text-[#7A5631]"
                                    }`}
                                >
                                    Una lista de regalos para celebrar una gran sorpresa.
                                </p>
                            ) : (
                                <p className={`mt-6 max-w-2xl text-xl font-bold leading-8 ${isAlldrickBabyShower
                                        ? "text-[#F5DEB3]"
                                        : "text-[#7A5631]"
                                    }`}    
                                >
                                    Una lista de regalos preparada con cariño para {event.honoreeName}
                                </p>
                            )}

                            {event.description ? (
                                <p className={`mt-4 max-w-2xl text-base font-semibold leading-7 ${isAlldrickBabyShower
                                        ? "text-[#F5DEB3]"
                                        : "text-[#8A6332]"
                                    }`}
                                >
                                    {event.description}
                                </p>
                            ) : null}
                        </div>

                        <div className="col-span-1 mt-8 grid gap-4 sm:col-span-5 sm:mt-0 sm:grid-cols-1">
                            <div className="rounded-[2rem] bg-white p-5 shadow-[0_14px_35px_rgba(111,72,29,0.12)]">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-12 items-center justify-center rounded-2xl bg-[#FFF0C2]">
                                        <CalendarDays className="size-6 text-[#C78A21]" />
                                    </div>

                                    <div>
                                        <p className="text-xs font-extrabold uppercase tracking-wide text-[#A47A42]">
                                            Fecha
                                        </p>

                                        <EventDateTime
                                            startsAt={event.date.toISOString()}
                                            endsAt={event.endDate?.toISOString()}
                                            eventTimezone={event.timezone ?? undefined}
                                        />

                                        {/* <div className="mt-2">
                                            <CountdownLabel
                                                date={event.date}
                                                timezone={event.timezone}
                                            />
                                        </div> */}
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[2rem] bg-white p-5 flex items-center justify-center shadow-[0_14px_35px_rgba(111,72,29,0.12)]">
                                <div className="flex w-full items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#FFF0C2]">
                                            <MapPin className="size-6 text-[#C78A21]" />
                                        </div>

                                        <div>
                                            <p className="text-xs font-extrabold uppercase tracking-wide text-[#A47A42]">
                                                Lugar
                                            </p>

                                            <p className="text-lg font-black text-[#3B2412]">
                                                {event.location}
                                            </p>
                                        </div>
                                    </div>

                                    {getSafeExternalUrl(event.locationURL) ? (
                                        <Link
                                            href={getSafeExternalUrl(event.locationURL)!}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="shrink-0 rounded-full bg-[#F8C63D] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#3E260E] shadow-[0_3px_0_#B97A22] transition group-hover:bg-[#FFD85F]"
                                        >
                                            Ver mapa
                                        </Link>
                                    ) : null}
                                </div>
                            </div>

                            {event.type === "BIRTHDAY" && event.birthdayAge ? (
                                <div className="rounded-[2rem] bg-white p-5 shadow-[0_14px_35px_rgba(111,72,29,0.12)]">
                                    <div className="flex items-center gap-4">
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#FFE4EC]">
                                            <Cake className="size-6 text-[#B94F6C]" />
                                        </div>

                                        <div>
                                            <p className="text-xs font-extrabold uppercase tracking-wide text-[#A47A42]">
                                                Cumple
                                            </p>

                                            <p className="text-lg font-black text-[#3B2412]">
                                                {event.birthdayAge} años
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {event.dressCode ? (
                                <div className="rounded-[2rem] bg-white p-5 shadow-[0_14px_35px_rgba(111,72,29,0.12)]">
                                    <div className="flex items-center gap-4">
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#E8F7EE]">
                                            <Shirt className="size-6 text-[#3E7A59]" />
                                        </div>

                                        <div>
                                            <p className="text-xs font-extrabold uppercase tracking-wide text-[#A47A42]">
                                                Dress code
                                            </p>

                                            <p className="text-lg font-black text-[#3B2412]">
                                                {event.dressCode}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {/* Dedicatorias de invitados */}
                            <div className="flex items-center justify-between gap-4 group block rounded-[2rem] bg-white p-5 shadow-[0_14px_35px_rgba(111,72,29,0.12)]">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-12 items-center justify-center rounded-2xl bg-[#FFF1B8]">
                                        <MessageSquareHeart className="size-6 text-[#B97A22]" />
                                    </div>

                                    <div>
                                        <p className="text-xs font-extrabold uppercase tracking-wide text-[#A47A42]">
                                            Dedicatorias
                                        </p>

                                        <p className="text-lg font-black text-[#3B2412]">
                                            {messagesCount === 1
                                                ? "1 dedicatoria"
                                                : messagesCount > 1
                                                    ? `${messagesCount} dedicatorias`
                                                    : "Libro de mensajes"}
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href={`/evento/${event.slug}/mensajes`}
                                    className="shrink-0 rounded-full bg-[#F8C63D] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#3E260E] shadow-[0_3px_0_#B97A22]">
                                    Ver mensajes
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-4 py-10 md:py-14">
                <div className="mb-6">
                    <p className="text-sm font-extrabold uppercase tracking-wide text-[#C78A21]">
                        Lista de regalos
                    </p>
                    <h2 className="mt-1 text-4xl font-black tracking-tight text-[#3B2412]">
                        Elige un regalo especial
                    </h2>
                    <p className="mt-2 max-w-xl text-base font-bold leading-7 text-[#7A5631]">
                        Marca un regalo como comprado para que nadie más lo elija.
                    </p>
                </div>

                {event.gifts.length === 0 ? (
                    <div className="mt-6 rounded-xl border border-dashed bg-background p-8 text-center">
                        <h3 className="font-medium">Todavía no hay regalos</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            El creador aún no agregó regalos a esta lista.
                        </p>
                    </div>
                ) : (
                    <div className="mt-6">
                            <PublicGiftList
                                eventSlug={event.slug}
                                gifts={event.gifts.map((gift) => ({
                                    id: gift.id,
                                    name: gift.name,
                                    imageUrl: gift.imageUrl,
                                    brand: gift.brand,
                                    price: gift.price ? gift.price.toString() : null,
                                    priceNumber: gift.price ? Number(gift.price.toString()) : null,
                                    currency: gift.currency,
                                    description: gift.description,
                                    color: gift.color,
                                    size: gift.size,
                                    dimensions: gift.dimensions,
                                    originalUrl: gift.originalUrl,
                                    status: gift.status,
                                    quantity: gift.quantity,
                                    purchasedQuantity: gift.purchasedQuantity,
                                }))}
                            />
                    </div>
                )}
            </section>

            {/* <section className="border-t bg-background">
                <div className="mx-auto max-w-5xl px-4 py-8 text-center">
                    <h2 className="text-lg font-semibold">¿Quieres crear tu propia lista?</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Crea una lista de regalos para baby shower, cumpleaños, matrimonio y más.
                    </p>

                    <Button asChild className="mt-4">
                        <Link href="/register">Crear mi lista gratis</Link>
                    </Button>
                </div>
            </section> */}
            <PendingPurchasePrompt />
        </main>
    );
}