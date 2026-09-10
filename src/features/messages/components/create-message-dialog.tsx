"use client";

import { useState, useTransition } from "react";
import { MessageSquareHeart, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { createMessageAction } from "@/features/messages/actions/create-message-action";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type CreateMessageDialogProps = {
    eventId: string;
    eventSlug: string;
    honoreeName?: string | null;
    triggerClassName?: string;
    triggerLabel?: string;
};

export function CreateMessageDialog({
    eventId,
    eventSlug,
    honoreeName,
    triggerClassName,
    triggerLabel = "Dejar dedicatoria",
}: CreateMessageDialogProps) {
    const [open, setOpen] = useState(false);
    const [authorName, setAuthorName] = useState("");
    const [content, setContent] = useState("");
    const [isPending, startTransition] = useTransition();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (content.trim().length < 2) {
            toast.error("Por favor escribe una dedicatoria antes de enviar.");
            return;
        }

        startTransition(async () => {
            const result = await createMessageAction(
                {
                    eventId,
                    authorName: authorName.trim() || undefined,
                    content: content.trim(),
                },
                eventSlug
            );

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            setAuthorName("");
            setContent("");
            setOpen(false);
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className={
                        triggerClassName ??
                        "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#F8C63D] px-6 text-sm font-black text-[#3E260E] shadow-[0_5px_0_#B97A22] transition hover:-translate-y-0.5 hover:bg-[#FFD85F]"
                    }
                >
                    <MessageSquareHeart className="size-4 text-[#B97A22]" />
                    {triggerLabel}
                </button>
            </DialogTrigger>

            <DialogContent className="max-w-md rounded-[2.5rem] border-2 border-[#E8C78A] bg-[#FFFDF7] p-6 md:p-8 shadow-[0_24px_70px_rgba(101,67,33,0.28)]">
                <DialogHeader className="text-center">
                    <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-[1.5rem] bg-[#FFF1B8] shadow-[0_4px_0_#E8C78A]">
                        <MessageSquareHeart className="size-7 text-[#B97A22]" />
                    </div>

                    <DialogTitle className="text-2xl font-black text-[#3E260E]">
                        Escribe tu dedicatoria
                    </DialogTitle>

                    <DialogDescription className="text-sm font-bold text-[#7A4E28]">
                        {honoreeName
                            ? `Envía un mensaje de cariño o felicitación para ${honoreeName}.`
                            : "Envía un mensaje de cariño o felicitación para este evento especial."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="text-xs font-black uppercase tracking-wide text-[#5A371C]">
                            Tu nombre o familia <span className="font-semibold text-[#8A6332]">(opcional)</span>
                        </label>
                        <input
                            type="text"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            placeholder="Ej. Tía Carmen, Rodrigo y Sofía"
                            maxLength={100}
                            className="mt-1.5 h-12 w-full rounded-2xl border-2 border-[#E8C78A] bg-[#FFF8E7] px-4 text-sm font-bold text-[#4A2D16] placeholder:text-[#B4966F] outline-none focus:border-[#F8C63D] focus:ring-4 focus:ring-[#F8D56B]/35"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-black uppercase tracking-wide text-[#5A371C]">
                            Tu mensaje o felicitación <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="¡Muchas felicidades! Que sea un día inolvidable lleno de alegría..."
                            maxLength={1000}
                            rows={4}
                            required
                            className="mt-1.5 w-full resize-none rounded-2xl border-2 border-[#E8C78A] bg-[#FFF8E7] p-4 text-sm font-bold text-[#4A2D16] placeholder:text-[#B4966F] outline-none focus:border-[#F8C63D] focus:ring-4 focus:ring-[#F8D56B]/35"
                        />
                        <p className="mt-1 text-right text-xs font-semibold text-[#A47A42]">
                            {content.length}/1000
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#E8C78A]/70 bg-[#FFF8E7] p-3.5 text-center text-xs font-semibold leading-5 text-[#8A6332]">
                        💛 Tu mensaje pasará por aprobación del anfitrión antes de publicarse en la lista.
                    </div>

                    <div className="mt-6 grid gap-3">
                        <button
                            type="submit"
                            disabled={isPending || content.trim().length < 2}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#F8C63D] px-6 text-sm font-black text-[#3E260E] shadow-[0_5px_0_#B97A22] transition hover:-translate-y-0.5 hover:bg-[#FFD85F] disabled:opacity-50"
                        >
                            <Send className="size-4" />
                            {isPending ? "Enviando..." : "Enviar dedicatoria"}
                        </button>

                        <button
                            type="button"
                            disabled={isPending}
                            onClick={() => setOpen(false)}
                            className="inline-flex h-12 items-center justify-center rounded-full border-2 border-[#E8C78A] bg-white px-6 text-sm font-black text-[#5A371C] transition hover:bg-[#FFF1C9]"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
