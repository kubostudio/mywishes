"use client";

import QRCode from "qrcode";
import { Copy, QrCode, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { StoryButton } from "@/components/storybook/story-button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type ShareEventDialogProps = {
    slug: string;
};

export function ShareEventDialog({ slug }: ShareEventDialogProps) {
    const [qrCodeUrl, setQrCodeUrl] = useState("");

    const publicUrl = useMemo(() => {
        if (typeof window === "undefined") return `/evento/${slug}`;
        return `${window.location.origin}/evento/${slug}`;
    }, [slug]);

    useEffect(() => {
        QRCode.toDataURL(publicUrl, {
            width: 320,
            margin: 2,
        }).then(setQrCodeUrl);
    }, [publicUrl]);

    async function handleCopy() {
        await navigator.clipboard.writeText(publicUrl);
        toast.success("Enlace copiado.");
    }

    async function handleShare() {
        if (!navigator.share) {
            await handleCopy();
            return;
        }

        await navigator.share({
            title: "Lista de regalos",
            url: publicUrl,
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <StoryButton type="button" variant="cream">
                    <Share2 className="size-4" />
                    Compartir
                </StoryButton>
            </DialogTrigger>

            <DialogContent className="rounded-[2rem] border-2 border-[#E8C78A] bg-[#FFFDF7] p-6 shadow-[0_24px_70px_rgba(101,67,33,0.22)]">
                <DialogHeader>
                    <DialogTitle>Compartir evento</DialogTitle>
                    <DialogDescription>
                        Comparte este enlace con tus invitados.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="rounded-md border bg-muted p-3 text-sm break-all">
                        {publicUrl}
                    </div>

                    {qrCodeUrl ? (
                        <div className="flex justify-center rounded-xl border p-4">
                            <img src={qrCodeUrl} alt="Código QR del evento" />
                        </div>
                    ) : null}

                    <div className="grid gap-3 md:grid-cols-2">
                        <StoryButton type="button" variant="cream" onClick={handleCopy}>
                            <Copy className="size-4" />
                            Copiar enlace
                        </StoryButton>

                        <StoryButton type="button" onClick={handleShare}>
                            <QrCode className="size-4" />
                            Compartir
                        </StoryButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}