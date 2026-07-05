import { notFound } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { EVENT_TYPE_LABELS } from "@/features/events/lib/event-labels";
import { getPublicEventBySlug } from "@/features/public-event/services/public-event-service";
import { PublicGiftList } from "@/features/public-event/components/public-gift-list";
import type { Metadata } from "next";
import { CountdownLabel } from "@/features/public-event/components/countdown-label";
import { HoneyBackground } from "@/components/storybook/story-decor";

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

    return (
        <main className="min-h-screen bg-[linear-gradient(180deg,#FFF8E8,#FFEFC4)]">
            <HoneyBackground />
            <section className="relative overflow-hidden border-b-2 border-[#F1D7A5] bg-[#FFF8E8]">
                <div className="absolute -left-20 top-10 size-72 rounded-full bg-[#FFD9E2]/70 blur-3xl" />
                <div className="absolute right-0 top-16 size-80 rounded-full bg-[#BDEBFF]/70 blur-3xl" />
                <div className="absolute bottom-0 left-1/2 size-72 rounded-full bg-[#FFE28A]/60 blur-3xl" />

                <div className="relative mx-auto max-w-5xl px-4 py-14 md:py-20">
                    <Badge className="rounded-full bg-[#FFE9AA] px-4 py-2 text-sm font-extrabold text-[#5A371C]">
                        {EVENT_TYPE_LABELS[event.type]}
                    </Badge>

                    <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[0.95] tracking-tight text-[#3B2412] sm:text-5xl md:text-7xl">
                        {event.name}
                    </h1>

                    <p className="mt-6 max-w-2xl text-xl font-bold leading-8 text-[#7A5631]">
                        Lista de regalos para {event.honoreeName}
                    </p>

                    {event.description ? (
                        <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-[#8A6332]">
                            {event.description}
                        </p>
                    ) : null}

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[2rem] bg-white p-5 shadow-[0_14px_35px_rgba(111,72,29,0.12)]">
                            <div className="flex items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-[#FFF0C2]">
                                    <CalendarDays className="size-6 text-[#C78A21]" />
                                </div>

                                <div>
                                    <p className="text-xs font-extrabold uppercase tracking-wide text-[#A47A42]">
                                        Fecha
                                    </p>
                                    <p className="text-lg font-black text-[#3B2412]">
                                        {event.date.toLocaleDateString("es-PE")} ·{" "}
                                        <CountdownLabel date={event.date} />
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[2rem] bg-white p-5 shadow-[0_14px_35px_rgba(111,72,29,0.12)]">
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
        </main>
    );
}