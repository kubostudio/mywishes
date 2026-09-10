"use client";

import { useState } from "react";
import { GalleryHorizontal, LayoutGrid, MessageSquareHeart, Sparkles, Heart } from "lucide-react";

import { MessagesCarousel } from "@/features/messages/components/messages-carousel";
import { MessagesGrid } from "@/features/messages/components/messages-grid";
import { CreateMessageDialog } from "@/features/messages/components/create-message-dialog";

type MessageItem = {
    id: string;
    authorName: string | null;
    content: string;
    createdAt: Date;
    gift?: {
        id: string;
        name: string;
        imageUrl?: string | null;
    } | null;
};

type MessagesViewContainerProps = {
    eventId: string;
    eventSlug: string;
    eventTitle: string;
    honoreeName?: string | null;
    messages: MessageItem[];
};

type ViewMode = "carousel" | "grid";

export function MessagesViewContainer({
    eventId,
    eventSlug,
    eventTitle,
    honoreeName,
    messages,
}: MessagesViewContainerProps) {
    const [viewMode, setViewMode] = useState<ViewMode>("carousel");

    const recipient = honoreeName?.trim() || eventTitle;

    return (
        <section className="space-y-8">
            {/* Top Toolbar: View switcher & CTA */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-[#8C5E28] justify-center">
                        <MessageSquareHeart className="h-4 w-4 text-[#B97A22]" />
                        <span>
                            {messages.length === 0
                                ? "Sin dedicatorias aún"
                                : messages.length === 1
                                ? "1 dedicatoria con cariño"
                                : `${messages.length} dedicatorias con cariño`}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    {/* View Switcher (Only if there are messages) */}
                    {messages.length > 0 && (
                        <div className="flex items-center rounded-2xl border-2 border-[#E8C78A] bg-[#FFF8E8] p-1 shadow-sm">
                            <button
                                type="button"
                                onClick={() => setViewMode("carousel")}
                                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                                    viewMode === "carousel"
                                        ? "bg-[#654321] text-white shadow-md"
                                        : "text-[#8C5E28] hover:bg-[#FFEFC4]"
                                }`}
                                aria-label="Vista de carrusel"
                            >
                                <GalleryHorizontal className="h-4 w-4" />
                                <span>Carrusel</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setViewMode("grid")}
                                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                                    viewMode === "grid"
                                        ? "bg-[#654321] text-white shadow-md"
                                        : "text-[#8C5E28] hover:bg-[#FFEFC4]"
                                }`}
                                aria-label="Vista de cuadrícula"
                            >
                                <LayoutGrid className="h-4 w-4" />
                                <span>Mosaico</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Empty State */}
            {messages.length === 0 ? (
                <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-dashed border-[#E8C78A] bg-gradient-to-b from-[#FFFDF7] to-[#FFF8E8] p-10 text-center shadow-[0_16px_40px_rgba(101,67,33,0.08)] sm:p-16">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FFEFC4] text-[#B97A22] shadow-inner">
                        <Heart className="h-10 w-10 fill-[#F8C63D] text-[#B97A22]" />
                    </div>

                    <h3 className="mt-6 text-2xl font-black text-[#3E260E] sm:text-3xl">
                        Aún no hay dedicatorias visibles
                    </h3>

                    <p className="mx-auto mt-3 max-w-lg text-base text-[#6E543C]">
                        Sé la primera persona en compartir unas palabras llenas de amor y buenos deseos para{" "}
                        <strong className="font-bold text-[#8C5E28]">{recipient}</strong>.
                    </p>

                    <div className="mt-8 flex justify-center">
                        <CreateMessageDialog
                            eventId={eventId}
                            eventSlug={eventSlug}
                            honoreeName={honoreeName}
                            triggerLabel="Dejar la primera dedicatoria"
                        />
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#8C5E28]/80">
                        <Sparkles className="h-3.5 w-3.5 text-[#F8C63D]" />
                        <span>Los mensajes pasan por una rápida revisión de los anfitriones antes de publicarse.</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Active View: Carousel or Grid */}
                    {viewMode === "carousel" ? (
                        <MessagesCarousel messages={messages} />
                    ) : (
                        <MessagesGrid messages={messages} />
                    )}

                    {/* Bottom encouragement banner */}
                    <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-3xl border-2 border-[#E8C78A] bg-[#FFF8E8] p-6 shadow-sm sm:flex-row sm:px-8">
                        <div className="flex items-center gap-3 text-center sm:text-left">
                            <div className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[#FFEFC4] text-[#B97A22] sm:flex">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-[#3E260E]">
                                    ¿Deseas enviar tus propios deseos?
                                </h4>
                                <p className="text-xs text-[#6E543C]">
                                    Puedes identificarte o enviar tu mensaje de forma totalmente anónima.
                                </p>
                            </div>
                        </div>

                        <CreateMessageDialog
                            eventId={eventId}
                            eventSlug={eventSlug}
                            honoreeName={honoreeName}
                            triggerLabel="Dejar dedicatoria"
                        />
                    </div>
                </>
            )}
        </section>
    );
}
