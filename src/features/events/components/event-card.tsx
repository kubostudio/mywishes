import Link from "next/link";
import type { Event } from "@prisma/client";
import { CalendarDays, Gift, MapPin } from "lucide-react";

import { AppBadge } from "@/components/design/app-badge";
import { AppCard } from "@/components/design/app-card";
import { AppLinkButton } from "@/components/design/app-button";
import { EVENT_TYPE_LABELS } from "@/features/events/lib/event-labels";

type EventCardProps = {
    event: Event;
};

function formatEventDate(date: Date, timeZone?: string | null) {
    return new Intl.DateTimeFormat("es-PE", {
        timeZone: timeZone ?? "America/Lima",
        weekday: "short",
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

export function EventCard({ event }: EventCardProps) {
    return (
        <AppCard className="group overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(111,72,29,0.18)]">
            <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <AppBadge>{EVENT_TYPE_LABELS[event.type]}</AppBadge>

                    <div className="flex size-11 items-center justify-center rounded-2xl bg-[#FFF0C2] text-[#A86D18]">
                        <Gift className="size-5" />
                    </div>
                </div>

                <h2 className="mt-3 line-clamp-2 text-2xl font-black leading-tight text-[#3B2412]">
                    {event.name}
                </h2>

                <div className="mt-6 space-y-3 text-sm font-bold text-[#8A6A46]">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="size-4 text-[#C78A21]" />
                        <span className="capitalize">
                            {formatEventDate(event.date, event.timezone)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-[#C78A21]" />
                        <span className="line-clamp-1">{event.location}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t-2 border-[#F1D7A5] bg-[#FFF8E8] p-4">
                <AppLinkButton href={`/dashboard/eventos/${event.id}`} className="h-11">
                    Administrar
                </AppLinkButton>

                <Link
                    href={`/evento/${event.slug}`}
                    target="_blank"
                    className="inline-flex h-11 items-center justify-center rounded-full border-2 border-[#E7C37B] bg-white text-sm font-extrabold text-[#5A371C] transition hover:bg-[#FFF1C9]"
                >
                    Ver público
                </Link>
            </div>
        </AppCard>
    );
}