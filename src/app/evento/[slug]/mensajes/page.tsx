import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { ForestDecor } from "@/components/storybook/story-decor";
import { getApprovedMessagesByEventSlug } from "@/features/messages/services/message-service";
import { MessagesViewContainer } from "@/features/messages/components/messages-view-container";

type PublicMessagesPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({
    params,
}: PublicMessagesPageProps): Promise<Metadata> {
    const { slug } = await params;
    const event = await getApprovedMessagesByEventSlug(slug);

    if (!event) {
        return {
            title: "Dedicatorias no encontradas | WishList",
        };
    }

    const honoree = event.honoreeName || event.name;
    return {
        title: `Dedicatorias y Deseos para ${honoree} | WishList`,
        description: `Lee los mensajes y bendiciones que amigos y familiares han compartido para celebrar a ${honoree}.`,
    };
}

export default async function PublicMessagesPage({
    params,
}: PublicMessagesPageProps) {
    const { slug } = await params;
    const event = await getApprovedMessagesByEventSlug(slug);

    if (!event) {
        notFound();
    }

    const honoree = event.honoreeName?.trim() || event.name;

    return (
        <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#FFF8E8,#FFEFC4)]">
            <ForestDecor sections={5} />

            {/* Header Hero */}
            <header className="relative overflow-hidden border-b-2 border-[#F1D7A5] bg-[#FFF8E8]">
                {/* Background ambient lighting */}
                <div className="absolute -left-20 top-10 size-72 rounded-full bg-[#FFD9E2]/60 blur-3xl pointer-events-none" />
                <div className="absolute right-0 top-16 size-80 rounded-full bg-[#FFE28A]/60 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/2 size-72 rounded-full bg-[#BDEBFF]/50 blur-3xl pointer-events-none" />

                <div className="relative mx-auto max-w-5xl px-4 py-10 sm:py-14">
                    {/* Back Link */}
                    <div className="mb-6">
                        <Link
                            href={`/evento/${slug}`}
                            className="inline-flex items-center gap-2 rounded-full border border-[#E8C78A] bg-[#FFFDF7] px-4 py-2 text-xs font-bold text-[#8C5E28] shadow-sm transition hover:border-[#B97A22] hover:bg-[#FFEFC4] hover:text-[#3E260E]"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Volver al evento y lista de regalos</span>
                        </Link>
                    </div>

                    <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight tracking-tight text-[#3B2412] sm:text-4xl md:text-6xl">
                        Deseos y Dedicatorias
                    </h1>

                    <p className="mt-4 max-w-2xl text-base font-bold leading-relaxed text-[#7A5631] sm:text-lg">
                        Un espacio especial donde familiares y amigos dejan sus palabras de amor, consejos y bendiciones para{" "}
                        <span className="text-[#3E260E] underline decoration-[#F8C63D] decoration-wavy underline-offset-4">
                            {honoree}
                        </span>.
                    </p>
                </div>
            </header>

            {/* Content Section */}
            <div className="relative mx-auto max-w-5xl px-4 py-10 md:py-14">
                <MessagesViewContainer
                    eventId={event.id}
                    eventSlug={event.slug}
                    eventTitle={event.name}
                    honoreeName={event.honoreeName}
                    messages={event.messages}
                />
            </div>
        </main>
    );
}
