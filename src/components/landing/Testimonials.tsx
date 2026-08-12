import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const testimonials = [
    {
        name: "María Fernanda A.",
        initials: "MA",
        event: "Baby Shower",
        text: "Pendiente",
        accent: "bg-[#FFD9E2]",
        avatar: "bg-[#FFE4EC]",
    },
    {
        name: "Bricelli M.",
        initials: "B",
        event: "Baby Shower",
        text: "Pendiente",
        accent: "bg-[#FFE38A]",
        avatar: "bg-[#FFF0C2]",
        featured: true,
    },
    {
        name: "Fabiana R.",
        initials: "FR",
        event: "Gender Reveal",
        text: "La página quedó muy linda y fue muy práctico, crear la lista fue súper fácil y a mis invitados les encantó poder ver todo desde un solo enlace. Además evitamos recibir regalos repetidos.",
        accent: "bg-[#BFE8D5]",
        avatar: "bg-[#E6F7EF]",
    },
];

export function Testimonials() {
    return (
        <section className="relative overflow-hidden py-16 md:py-24">
            {/* Decoración de fondo */}
            <div className="absolute -left-24 top-20 size-72 rounded-full bg-[#FFD9E2]/30 blur-3xl" />
            <div className="absolute -right-24 bottom-10 size-72 rounded-full bg-[#BFE8D5]/40 blur-3xl" />

            <div className="relative mx-auto max-w-6xl px-4">
                <Reveal delay={220}>
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF1B8] px-4 py-2 text-xs font-black uppercase tracking-wide text-[#5A371C]">
                            <Star className="size-4 fill-[#F8C63D] text-[#B97A22]" />
                            Lo que dicen nuestros usuarios
                        </div>

                        <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-tight text-[#3E260E] md:text-5xl">
                            Listas especiales para momentos que también lo son.
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold leading-8 text-[#7A4E28]">
                            Personas que organizaron sus celebraciones con MyWishes y
                            compartieron sus listas de una forma simple y bonita.
                        </p>
                    </div>
                </Reveal>

                <div className="mt-12 grid gap-6 md:grid-cols-3 md:items-stretch">
                    {testimonials.map((testimonial, index) => {
                        const direction =
                            index === 0
                                ? "left"
                                : index === 1
                                    ? "up"
                                    : "right";

                        return (
                            <Reveal
                                key={testimonial.name}
                                direction={direction}
                                delay={index * 120}
                                className="h-full"
                            >
                                <article
                                    className={[
                                        "group relative flex min-h-[340px] h-full flex-col overflow-hidden",
                                        "rounded-[2.25rem] border-2 border-[#E8C78A]",
                                        "bg-[#FFFDF7] p-7",
                                        "shadow-[0_12px_0_#E8C78A]",
                                        "transition-all duration-300",
                                        "hover:-translate-y-2 hover:shadow-[0_18px_0_#E8C78A]",
                                        testimonial.featured
                                            ? "md:-translate-y-4 md:hover:-translate-y-6"
                                            : "",
                                    ].join(" ")}
                                >
                                    {/* Mancha decorativa */}
                                    <div
                                        className={`absolute -right-12 -top-12 size-36 rounded-full ${testimonial.accent}`}
                                    />

                                    {/* Comillas */}
                                    <div className="relative flex items-start justify-between">
                                        <div className="flex gap-1">
                                            {Array.from({ length: 5 }).map((_, starIndex) => (
                                                <Star
                                                    key={starIndex}
                                                    className="size-4 fill-[#F8C63D] text-[#F8C63D]"
                                                />
                                            ))}
                                        </div>

                                        <div className="relative flex size-11 items-center justify-center rounded-2xl bg-white/70">
                                            <Quote className="size-5 text-[#B97A22]" />
                                        </div>
                                    </div>

                                    {/* Testimonio */}
                                    <p className="relative mt-7 flex-1 text-lg font-bold leading-8 text-[#5A371C]">
                                        “{testimonial.text}”
                                    </p>

                                    {/* Usuario */}
                                    <div className="relative mt-7 flex items-center gap-3 border-t border-[#E8C78A]/60 pt-5">
                                        <div
                                            className={`flex size-12 shrink-0 items-center justify-center rounded-full ${testimonial.avatar} text-sm font-black text-[#5A371C]`}
                                        >
                                            {testimonial.initials}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="font-black text-[#3E260E]">
                                                {testimonial.name}
                                            </p>

                                            <div className="mt-1 inline-flex rounded-full bg-[#FFF1B8] px-3 py-1 text-xs font-black text-[#8A6332]">
                                                {testimonial.event}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}