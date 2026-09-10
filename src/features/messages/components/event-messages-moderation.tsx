"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
    CheckCircle2,
    XCircle,
    Trash2,
    MessageSquareHeart,
    Clock,
    ExternalLink,
    AlertCircle,
    User,
    Gift,
} from "lucide-react";
import { toast } from "sonner";

import { StoryCard } from "@/components/storybook/story-card";
import {
    moderateMessageAction,
    deleteMessageAction,
} from "@/features/messages/actions/moderate-message-action";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type ModerationMessageItem = {
    id: string;
    authorName: string | null;
    content: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: Date;
    gift?: {
        id: string;
        name: string;
        imageUrl?: string | null;
    } | null;
};

type EventMessagesModerationProps = {
    eventId: string;
    eventSlug: string;
    messages: ModerationMessageItem[];
};

type FilterStatus = "PENDING" | "APPROVED" | "REJECTED" | "ALL";

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("es-PE", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
}

export function EventMessagesModeration({
    eventId,
    eventSlug,
    messages,
}: EventMessagesModerationProps) {
    const [activeFilter, setActiveFilter] = useState<FilterStatus>("PENDING");
    const [isPending, startTransition] = useTransition();
    const [actionId, setActionId] = useState<string | null>(null);

    const pendingCount = messages.filter((m) => m.status === "PENDING").length;
    const approvedCount = messages.filter((m) => m.status === "APPROVED").length;
    const rejectedCount = messages.filter((m) => m.status === "REJECTED").length;

    const filteredMessages = messages.filter((m) => {
        if (activeFilter === "ALL") return true;
        return m.status === activeFilter;
    });

    function handleModerate(messageId: string, status: "APPROVED" | "REJECTED") {
        setActionId(messageId);
        startTransition(async () => {
            try {
                const res = await moderateMessageAction({
                    eventId,
                    messageId,
                    status,
                });
                if (res.success) {
                    toast.success(res.message);
                } else {
                    toast.error(res.message);
                }
            } catch {
                toast.error("Ocurrió un error al procesar el mensaje.");
            } finally {
                setActionId(null);
            }
        });
    }

    function handleDelete(messageId: string) {
        setActionId(messageId);
        startTransition(async () => {
            try {
                const res = await deleteMessageAction(messageId, eventId);
                if (res.success) {
                    toast.success(res.message);
                } else {
                    toast.error(res.message);
                }
            } catch {
                toast.error("Ocurrió un error al eliminar el mensaje.");
            } finally {
                setActionId(null);
            }
        });
    }

    return (
        <StoryCard className="p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#B97A22]">
                        <MessageSquareHeart className="size-4" />
                        Dedicatorias de los invitados
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight text-[#3E260E] md:text-4xl">
                        Moderación de Mensajes
                    </h2>

                    <p className="mt-2 max-w-xl text-base font-semibold leading-7 text-[#7A4E28]">
                        Aprueba o rechaza los mensajes que dejan los invitados al marcar regalos o
                        desde la página de dedicatorias.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        href={`/evento/${eventSlug}/mensajes`}
                        target="_blank"
                        className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#E8C78A] bg-[#FFF8E8] px-4 py-2.5 text-sm font-bold text-[#8C5E28] shadow-sm transition hover:bg-[#FFEFC4] hover:text-[#3E260E]"
                    >
                        <span>Ver libro público</span>
                        <ExternalLink className="size-4" />
                    </Link>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-[#E8C78A]/60 pb-4">
                <button
                    type="button"
                    onClick={() => setActiveFilter("PENDING")}
                    className={`relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
                        activeFilter === "PENDING"
                            ? "bg-[#654321] text-white shadow-sm"
                            : "bg-[#FFF8E8] text-[#8C5E28] hover:bg-[#FFEFC4]"
                    }`}
                >
                    <span>Pendientes</span>
                    <span
                        className={`rounded-full px-2 py-0.5 text-xs font-black ${
                            pendingCount > 0
                                ? "bg-[#F8C63D] text-[#3E260E]"
                                : "bg-black/10 text-inherit"
                        }`}
                    >
                        {pendingCount}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveFilter("APPROVED")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
                        activeFilter === "APPROVED"
                            ? "bg-[#654321] text-white shadow-sm"
                            : "bg-[#FFF8E8] text-[#8C5E28] hover:bg-[#FFEFC4]"
                    }`}
                >
                    <span>Aprobados</span>
                    <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs font-black">
                        {approvedCount}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveFilter("REJECTED")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
                        activeFilter === "REJECTED"
                            ? "bg-[#654321] text-white shadow-sm"
                            : "bg-[#FFF8E8] text-[#8C5E28] hover:bg-[#FFEFC4]"
                    }`}
                >
                    <span>Rechazados</span>
                    <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs font-black">
                        {rejectedCount}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveFilter("ALL")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
                        activeFilter === "ALL"
                            ? "bg-[#654321] text-white shadow-sm"
                            : "bg-[#FFF8E8] text-[#8C5E28] hover:bg-[#FFEFC4]"
                    }`}
                >
                    <span>Todos</span>
                    <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs font-black">
                        {messages.length}
                    </span>
                </button>
            </div>

            {/* Message List */}
            <div className="mt-6">
                {filteredMessages.length === 0 ? (
                    <div className="rounded-[2rem] border-2 border-dashed border-[#E8C78A] bg-[#FFF8E7] p-10 text-center">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#FFEFC4] text-[#B97A22]">
                            <MessageSquareHeart className="size-7" />
                        </div>
                        <h3 className="mt-4 text-xl font-bold text-[#3E260E]">
                            {activeFilter === "PENDING"
                                ? "No hay dedicatorias pendientes"
                                : activeFilter === "APPROVED"
                                ? "Aún no hay dedicatorias aprobadas"
                                : activeFilter === "REJECTED"
                                ? "No hay dedicatorias rechazadas"
                                : "Aún no has recibido dedicatorias"}
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-sm font-semibold text-[#7A4E28]">
                            {activeFilter === "PENDING"
                                ? "¡Excelente! Estás al día con todos los mensajes de tus invitados."
                                : "Los mensajes que dejen tus invitados aparecerán en esta sección para que los revises."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredMessages.map((msg) => {
                            const isBusy = isPending && actionId === msg.id;
                            const author = msg.authorName?.trim() || "Invitado anónimo";

                            return (
                                <div
                                    key={msg.id}
                                    className="flex flex-col justify-between gap-4 rounded-3xl border-2 border-[#E8C78A] bg-[#FFFDF7] p-5 shadow-sm transition hover:shadow-md md:flex-row md:items-center md:p-6"
                                >
                                    <div className="space-y-3 md:max-w-2xl">
                                        {/* Author & Status header */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="flex items-center gap-2 font-bold text-[#3E260E]">
                                                <div className="flex size-7 items-center justify-center rounded-full bg-[#FFEFC4] text-[#8C5E28]">
                                                    <User className="size-4" />
                                                </div>
                                                <span className="text-base">{author}</span>
                                            </div>

                                            <span className="text-xs text-[#8C5E28]/60">•</span>

                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#8C5E28]">
                                                <Clock className="size-3" />
                                                {formatDate(msg.createdAt)}
                                            </span>

                                            {/* Status Badge */}
                                            {msg.status === "PENDING" && (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-[#F8C63D] bg-[#FFF3D6] px-2.5 py-0.5 text-xs font-extrabold text-[#8C5E28]">
                                                    <AlertCircle className="size-3 text-[#B97A22]" />
                                                    Pendiente
                                                </span>
                                            )}

                                            {msg.status === "APPROVED" && (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-extrabold text-emerald-800">
                                                    <CheckCircle2 className="size-3 text-emerald-600" />
                                                    Aprobado
                                                </span>
                                            )}

                                            {msg.status === "REJECTED" && (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-rose-50 px-2.5 py-0.5 text-xs font-extrabold text-rose-800">
                                                    <XCircle className="size-3 text-rose-600" />
                                                    Rechazado
                                                </span>
                                            )}

                                            {/* Purchased Gift Badge */}
                                            {msg.gift && (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-[#E8C78A] bg-[#FFF8E7] px-2.5 py-0.5 text-xs font-bold text-[#7A4E28]">
                                                    <Gift className="size-3 text-[#B97A22]" />
                                                    Regaló: <strong className="font-extrabold text-[#3E260E]">{msg.gift.name}</strong>
                                                </span>
                                            )}
                                        </div>

                                        {/* Content body */}
                                        <p className="rounded-2xl border border-[#F1D7A5]/60 bg-[#FFF8E8]/60 p-4 text-sm font-medium leading-relaxed text-[#5A3E22] sm:text-base">
                                            &ldquo;{msg.content}&rdquo;
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap items-center gap-2 border-t border-[#F1D7A5]/60 pt-3 md:border-t-0 md:pt-0">
                                        {msg.status !== "APPROVED" && (
                                            <button
                                                type="button"
                                                disabled={isBusy}
                                                onClick={() => handleModerate(msg.id, "APPROVED")}
                                                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400 bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                                            >
                                                <CheckCircle2 className="size-4" />
                                                <span>Aprobar</span>
                                            </button>
                                        )}

                                        {msg.status !== "REJECTED" && (
                                            <button
                                                type="button"
                                                disabled={isBusy}
                                                onClick={() => handleModerate(msg.id, "REJECTED")}
                                                className="inline-flex items-center gap-1.5 rounded-xl border border-[#E8C78A] bg-[#FFF8E8] px-3.5 py-2 text-xs font-bold text-[#8C5E28] shadow-sm transition hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 disabled:opacity-50"
                                            >
                                                <XCircle className="size-4" />
                                                <span>Rechazar</span>
                                            </button>
                                        )}

                                        {/* Delete Action Dialog */}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button
                                                    type="button"
                                                    disabled={isBusy}
                                                    className="inline-flex size-9 items-center justify-center rounded-xl border border-transparent text-[#8C5E28]/70 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                                                    title="Eliminar dedicatoria"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="rounded-3xl border-2 border-[#E8C78A] bg-[#FFFDF7] text-[#3E260E]">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-xl font-bold text-[#3E260E]">
                                                        ¿Eliminar esta dedicatoria?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription className="text-sm font-medium text-[#7A4E28]">
                                                        Esta acción no se puede deshacer. El mensaje de{" "}
                                                        <strong>{author}</strong> será eliminado permanentemente.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="rounded-xl border-[#E8C78A] bg-[#FFF8E8] font-bold text-[#8C5E28] hover:bg-[#FFEFC4]">
                                                        Cancelar
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(msg.id)}
                                                        className="rounded-xl bg-rose-600 font-bold text-white hover:bg-rose-700"
                                                    >
                                                        Eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </StoryCard>
    );
}
