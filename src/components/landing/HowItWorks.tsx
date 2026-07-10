import Link from "next/link";
import {
    CalendarHeart,
    ListChecks,
    Share2,
    TabletSmartphone,
} from "lucide-react";

import { StoryCard } from "@/components/storybook/story-card";


export function HowItWorks() {
    return (
        <section className="mx-auto max-w-6xl px-4 py-10 flex flex-col gap-8 items-center">
            <span className="text-4xl font-bold text-center text-[#3E260E] leading-tight md:text-5xl">
                ¿Cómo funciona?
            </span>
            <div className="grid gap-5 md:grid-cols-4">
                {[
                    {
                        icon: CalendarHeart,
                        title: "Crea tu evento",
                        text: "Configura la fecha, lugar y detalles principales de tu celebración.",
                    },
                    {
                        icon: ListChecks,
                        title: "Organiza tus regalos",
                        text: "Agrega cualquier regalo que quieras recibir en una sola lista.",
                    },
                    {
                        icon: Share2,
                        title: "Comparte fácilmente",
                        text: "Envía tu lista mediante un enlace por WhatsApp, Instagram o cualquier red social.",
                    },
                    {
                        icon: TabletSmartphone,
                        title: "Accede desde cualquier dispositivo",
                        text: "Funciona perfectamente en computadoras, tablets y celulares.",
                    },
                ].map((item) => (
                    <StoryCard key={item.title} className="p-4">
                        <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#FFF1B8]">
                            <item.icon className="size-6 text-[#B97A22]" />
                        </div>

                        <h3 className="text-xl font-bold text-[#3E260E]">
                            {item.title}
                        </h3>

                        <p className="mt-3 text-sm font-semibold leading-7 text-[#7A4E28]">
                            {item.text}
                        </p>
                    </StoryCard>
                ))}
            </div>
        </section>
    );
}