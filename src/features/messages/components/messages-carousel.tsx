"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Heart, Gift } from "lucide-react";

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

type MessagesCarouselProps = {
    messages: MessageItem[];
};

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("es-PE", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(date));
}

export function MessagesCarousel({ messages }: MessagesCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (messages.length === 0) return null;

    const current = messages[currentIndex];

    function handlePrev() {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : messages.length - 1));
    }

    function handleNext() {
        setCurrentIndex((prev) => (prev < messages.length - 1 ? prev + 1 : 0));
    }

    return (
        <div className="relative mx-auto max-w-2xl">
            {/* Main Carousel Card */}
            <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-[#E8C78A] bg-[#FFFDF7] p-8 md:p-12 shadow-[0_24px_70px_rgba(101,67,33,0.14)] transition-all duration-300">
                {/* Decorative background blurs */}
                <div className="absolute -left-10 -top-10 size-36 rounded-full bg-[#FFE9AA]/50 blur-2xl pointer-events-none" />
                <div className="absolute -right-10 -bottom-10 size-40 rounded-full bg-[#FFD9E2]/40 blur-2xl pointer-events-none" />

                {/* Top bar: Author Badge & Date */}
                <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-[#F1D7A5]/80 pb-5">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-[#FFE9AA] text-[#B97A22]">
                            <Heart className="size-5 fill-[#B97A22]/20" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-wider text-[#A47A42]">
                                Dedicatoria de
                            </p>
                            <p className="text-base font-black text-[#3E260E]">
                                {current.authorName?.trim() || "Un invitado anónimo"}
                            </p>
                        </div>
                    </div>

                    <span className="rounded-full bg-[#FFF8E7] px-3.5 py-1 text-xs font-extrabold text-[#8A6332] border border-[#E8C78A]/60">
                        {formatDate(current.createdAt)}
                    </span>
                </div>

                {/* Quote Body */}
                <div className="relative my-8 min-h-[140px] flex items-center">
                    <Quote className="absolute -top-3 -left-2 size-12 text-[#E8C78A]/30 rotate-180 pointer-events-none" />
                    <p className="relative z-10 text-xl font-black leading-relaxed tracking-tight text-[#4A2D16] md:text-2xl">
                        &ldquo;{current.content}&rdquo;
                    </p>
                </div>

                {/* Purchased Gift Tag */}
                {current.gift && (
                    <div className="relative z-10 mb-6 inline-flex items-center gap-2 rounded-2xl border border-[#E8C78A] bg-[#FFF8E7] px-4 py-2 shadow-sm">
                        <div className="flex size-7 items-center justify-center rounded-xl bg-[#FFE9AA] text-[#B97A22]">
                            <Gift className="size-4" />
                        </div>
                        <span className="text-xs font-bold text-[#7A4E28]">
                            Regaló: <strong className="font-extrabold text-[#3E260E]">{current.gift.name}</strong>
                        </span>
                    </div>
                )}

                {/* Bottom navigation bar */}
                <div className="relative flex items-center justify-between border-t border-[#F1D7A5]/80 pt-5">
                    <button
                        type="button"
                        onClick={handlePrev}
                        aria-label="Dedicatoria anterior"
                        className="flex size-12 items-center justify-center rounded-full border-2 border-[#E8C78A] bg-white text-[#5A371C] shadow-[0_3px_0_#E8C78A] transition hover:-translate-y-0.5 hover:bg-[#FFE9AA] active:translate-y-0"
                    >
                        <ChevronLeft className="size-6" />
                    </button>

                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-[#8A6332]">
                            {currentIndex + 1} de {messages.length}
                        </span>

                        {/* Pagination Dots */}
                        <div className="flex items-center gap-1.5">
                            {messages.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setCurrentIndex(idx)}
                                    aria-label={`Ir al mensaje ${idx + 1}`}
                                    className={`transition-all duration-300 rounded-full ${
                                        idx === currentIndex
                                            ? "h-2.5 w-7 bg-[#B97A22]"
                                            : "size-2.5 bg-[#E8C78A] hover:bg-[#C78A21]"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Siguiente dedicatoria"
                        className="flex size-12 items-center justify-center rounded-full border-2 border-[#E8C78A] bg-[#F8C63D] text-[#3E260E] shadow-[0_3px_0_#B97A22] transition hover:-translate-y-0.5 hover:bg-[#FFD85F] active:translate-y-0"
                    >
                        <ChevronRight className="size-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}
