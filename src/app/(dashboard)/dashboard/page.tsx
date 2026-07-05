import { Gift, PartyPopper, Sparkles } from "lucide-react";

import { requireUser } from "@/lib/auth-session";
import { CreateEventDialog } from "@/features/events/components/create-event-dialog";
import { EventCard } from "@/features/events/components/event-card";
import { getEventsByCreatorId } from "@/features/events/services/event-service";

export default async function DashboardPage() {
    const user = await requireUser();
    const events = await getEventsByCreatorId(user.id);

    return (
        <div className="space-y-10">
            <section className="relative overflow-hidden rounded-[2.5rem] bg-[#FFF7DF] p-8 shadow-[0_20px_60px_rgba(111,72,29,0.14)] md:p-12">
                <div className="absolute -right-12 -top-12 size-48 rounded-full bg-[#FFD9E2]" />
                <div className="absolute bottom-8 right-40 size-36 rounded-full bg-[#BDEBFF]" />
                <div className="absolute -bottom-16 left-1/2 size-52 rounded-full bg-[#FFE28A]" />

                <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-[#6A421F] shadow-sm">
                            <Sparkles className="size-4 text-[#F4B42A]" />
                            Crea una lista linda para tu evento
                        </div>

                        <h1 className="max-w-2xl text-5xl font-black leading-[0.95] tracking-tight text-[#3B2412] md:text-6xl">
                            Regalos fáciles de elegir, compartir y recordar.
                        </h1>

                        <p className="mt-5 max-w-xl text-lg font-bold leading-8 text-[#7A5631]">
                            Organiza los regalos de tu celebración en una lista visual,
                            simple y pensada para tus invitados.
                        </p>
                    </div>

                    <div className="flex flex-col items-start gap-4 md:items-end">
                        <div className="hidden rounded-[2rem] bg-white p-5 shadow-[0_12px_30px_rgba(111,72,29,0.12)] md:block">
                            <div className="flex size-16 items-center justify-center rounded-3xl bg-[#FFF0C2]">
                                <Gift className="size-8 text-[#C78A21]" />
                            </div>
                        </div>

                        <CreateEventDialog />
                    </div>
                </div>
            </section>

            {events.length === 0 ? (
                <section className="rounded-[2rem] border-2 border-dashed border-[#E7C37B] bg-white/80 p-12 text-center">
                    <div className="mx-auto flex size-20 items-center justify-center rounded-[2rem] bg-[#FFF0C2]">
                        <PartyPopper className="size-10 text-[#C78A21]" />
                    </div>

                    <h2 className="mt-6 text-3xl font-black text-[#3B2412]">
                        Aún no tienes eventos
                    </h2>

                    <p className="mx-auto mt-3 max-w-md text-base font-bold leading-7 text-[#7A5631]">
                        Crea tu primera lista de regalos y compártela con tus familiares y
                        amigos.
                    </p>
                </section>
            ) : (
                <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </section>
            )}
        </div>
    );
}