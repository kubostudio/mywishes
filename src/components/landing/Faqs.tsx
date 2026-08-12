import { Reveal } from "@/components/ui/reveal";

export function Faqs() {
    const faqs = [
        {
            question: "¿Qué es MyWishes?",
            answer:
                "MyWishes es una plataforma para crear y compartir listas de regalos de forma sencilla y gratuita.",
        },
        {
            question: "¿Necesito crear una cuenta?",
            answer:
                "Sí. Solo necesitas una cuenta para crear y administrar tus listas.",
        },
        {
            question: "¿Mis invitados necesitan registrarse?",
            answer:
                "No. Ellos solo reciben el enlace y pueden ver la lista sin crear cuenta.",
        },
        {
            question: "¿Puedo modificar mi lista después?",
            answer:
                "Sí. Puedes agregar, editar o eliminar regalos cuando quieras.",
        },
        {
            question: "¿Es gratis?",
            answer:
                "Sí. Puedes crear y compartir listas de regalos sin costo.",
        },
    ];

    return (
        <section className="relative overflow-hidden px-6 py-24">
            <div className="absolute -left-24 top-20 size-72 animate-gentle-float rounded-full bg-[#BFE8D5]/40 blur-3xl" />

            <div
                className="absolute -right-24 bottom-10 size-72 animate-gentle-float rounded-full bg-[#FFD9E2]/30 blur-3xl"
                style={{ animationDelay: "1.5s" }}
            />

            <div className="relative mx-auto max-w-4xl">
                <Reveal direction="up">
                    <div className="text-center">
                        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#3E260E] md:text-5xl">
                            Preguntas frecuentes
                        </h2>

                        <p className="mt-5 font-semibold text-[#7A4E28]">
                            Todo lo que necesitas saber antes de crear tu lista de regalos.
                        </p>
                    </div>
                </Reveal>

                <div className="mt-12 space-y-4">
                    {faqs.map((faq, index) => (
                        <Reveal
                            key={faq.question}
                            direction={index % 2 === 0 ? "left" : "right"}
                            delay={index * 80}
                        >
                            <details
                                className="
                                    group
                                    rounded-3xl
                                    border border-[#F1DFC0]
                                    bg-[#FFF8EA]
                                    p-6
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:border-[#E8C78A]
                                    hover:shadow-[0_12px_30px_rgba(111,72,29,0.10)]
                                    open:bg-[#FFFDF7]
                                    open:shadow-[0_12px_30px_rgba(111,72,29,0.10)]
                                "
                            >
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-[#5F4B32] transition-colors duration-300 group-open:text-[#B97A22]">
                                    {faq.question}

                                    <span
                                        className="
                                            flex size-8 shrink-0 items-center justify-center
                                            rounded-full
                                            bg-[#FFF1B8]
                                            text-2xl
                                            leading-none
                                            text-[#A47A42]
                                            transition-all
                                            duration-300
                                            group-hover:scale-110
                                            group-open:rotate-45
                                            group-open:bg-[#FFE38A]
                                        "
                                    >
                                        +
                                    </span>
                                </summary>

                                <p className="mt-4 font-semibold leading-7 text-[#7A4E28]">
                                    {faq.answer}
                                </p>
                            </details>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}