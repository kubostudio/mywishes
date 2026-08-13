import {
    CalendarHeart,
    ListChecks,
    Share2,
    TabletSmartphone,
} from "lucide-react";

import { StoryCard } from "@/components/storybook/story-card";
import { Reveal } from "@/components/ui/reveal";

export function HowItWorks() {
    const items = [
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
    ];

    return (
        <section className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-10">
            <Reveal direction="up">
                <h2 className="text-center text-4xl font-bold leading-tight text-[#3E260E] md:text-5xl">
                    ¿Cómo funciona?
                </h2>
            </Reveal>

            <div className="grid gap-5 md:grid-cols-4">
                {items.map((item, index) => {
                    const direction =
                        index % 2 === 0 ? "left" : "right";

                    return (
                        <Reveal
                            key={item.title}
                            direction={direction}
                            delay={index * 90}
                            className="h-full"
                        >
                            <StoryCard className="group h-full p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_40px_rgba(111,72,29,0.16)]">
                                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#FFF1B8] transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                    <item.icon className="size-6 text-[#B97A22] transition-transform duration-300 group-hover:scale-110" />
                                </div>

                                <h3 className="text-xl font-bold text-[#3E260E]">
                                    {item.title}
                                </h3>

                                <p className="mt-3 text-sm font-semibold leading-7 text-[#7A4E28]">
                                    {item.text}
                                </p>
                            </StoryCard>
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}