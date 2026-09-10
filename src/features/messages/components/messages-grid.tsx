import { Heart, Quote, Gift } from "lucide-react";

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

type MessagesGridProps = {
    messages: MessageItem[];
};

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("es-PE", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}

export function MessagesGrid({ messages }: MessagesGridProps) {
    if (messages.length === 0) return null;

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {messages.map((message) => {
                const author = message.authorName?.trim() || "Invitado anónimo";

                return (
                    <article
                        key={message.id}
                        className="group flex flex-col justify-between overflow-hidden rounded-[2.5rem] border-2 border-[#E8C78A] bg-[#FFFDF7] p-6 shadow-[0_16px_40px_rgba(101,67,33,0.12)] transition duration-300 hover:-translate-y-1 hover:border-[#F8C63D] hover:shadow-[0_22px_50px_rgba(101,67,33,0.18)]"
                    >
                        {/* Top: Author header */}
                        <div>
                            <div className="flex items-center justify-between gap-3 border-b border-[#F1D7A5]/70 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-2xl bg-[#FFF1B8] text-[#B97A22] shadow-[0_3px_0_#E8C78A] group-hover:scale-105 transition-transform">
                                        <Heart className="size-5 fill-[#B97A22]/20" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-wider text-[#A47A42]">
                                            De
                                        </p>
                                        <h3 className="text-base font-black text-[#3E260E] line-clamp-1">
                                            {author}
                                        </h3>
                                    </div>
                                </div>

                                <span className="rounded-full bg-[#FFF8E7] px-3 py-1 text-[11px] font-extrabold text-[#8A6332] border border-[#E8C78A]/60 shrink-0">
                                    {formatDate(message.createdAt)}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="relative mt-5 mb-4">
                                <Quote className="size-6 text-[#E8C78A]/40 mb-2 rotate-180" />
                                <p className="text-base font-extrabold leading-relaxed text-[#4A2D16] whitespace-pre-line">
                                    &ldquo;{message.content}&rdquo;
                                </p>
                            </div>

                            {/* Purchased Gift Tag */}
                            {message.gift && (
                                <div className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-[#E8C78A] bg-[#FFF8E7] px-3.5 py-1.5 shadow-sm">
                                    <div className="flex size-6 items-center justify-center rounded-lg bg-[#FFE9AA] text-[#B97A22]">
                                        <Gift className="size-3.5" />
                                    </div>
                                    <span className="text-xs font-bold text-[#7A4E28] line-clamp-1">
                                        Regaló: <strong className="font-extrabold text-[#3E260E]">{message.gift.name}</strong>
                                    </span>
                                </div>
                            )}
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
