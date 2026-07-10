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
            answer: "Sí. Puedes crear y compartir listas de regalos sin costo.",
        },
    ];

    return (
        <section className="bg-white px-6 py-24 bg-[linear-gradient(0deg,#FFF8E8,#FFEFC4)]">
            <div className="mx-auto max-w-4xl">
                <div className="text-center">
                    <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#A47A42]">
                        FAQ
                    </span>

                    <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#3E260E] md:text-5xl">
                        Preguntas frecuentes
                    </h2>

                    <p className="mt-5 font-semibold text-[#7A4E28]">
                        Todo lo que necesitas saber antes de crear tu lista de regalos.
                    </p>
                </div>

                <div className="mt-12 space-y-4">
                    {faqs.map((faq) => (
                        <details
                            key={faq.question}
                            className="group rounded-3xl border border-[#F1DFC0] bg-[#FFF8EA] p-6"
                        >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-[#5F4B32]">
                                {faq.question}
                                <span className="text-2xl text-[#A47A42] transition-transform group-open:rotate-45">
                                    +
                                </span>
                            </summary>

                            <p className="mt-4 leading-7 font-semibold text-[#7A4E28]">{faq.answer}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}