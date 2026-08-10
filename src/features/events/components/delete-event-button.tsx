"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteEventAction } from "@/features/events/actions/delete-event-action";

import { Button } from "@/components/ui/button";
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

type DeleteEventButtonProps = {
    eventId: string;
};

export function DeleteEventButton({ eventId }: DeleteEventButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        startTransition(async () => {
            const result = await deleteEventAction(eventId);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            router.push("/dashboard");
            router.refresh();
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button
                    type="button"
                    disabled={isPending}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#EF6A5B] px-6 text-sm font-black text-white shadow-[0_5px_0_#B94439] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60"
                >
                    <Trash2 className="size-4" />
                    Eliminar
                </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="rounded-[2rem] border-2 border-[#E8C78A] bg-[#FFFDF7] p-6 shadow-[0_24px_70px_rgba(101,67,33,0.22)]">
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>

                    <AlertDialogDescription>
                        El evento dejará de estar disponible para ti y para tus invitados.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        {isPending ? "Eliminando..." : "Eliminar evento"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}