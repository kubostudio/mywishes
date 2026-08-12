import Link from "next/link";
import { Mail, MessageCircle, ArrowLeft } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[linear-gradient(180deg,#FFF8E8,#FFEFC4)] px-4 py-12 md:py-16">
            <div className="mx-auto max-w-3xl">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-black text-[#B97A22] transition hover:text-[#8A5A24]"
                >
                    <ArrowLeft className="size-4" />
                    Volver a MyWishes
                </Link>

                <section className="mt-8 rounded-[2.5rem] border-2 border-[#E8C78A] bg-[#FFFDF7] p-6 shadow-[0_24px_70px_rgba(101,67,33,0.14)] md:p-10">
                    <div className="text-center">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-[1.75rem] bg-[#FFF1B8] text-[#B97A22]">
                            <MessageCircle className="size-8" />
                        </div>

                        <h1 className="mt-6 text-4xl font-black tracking-tight text-[#3E260E] md:text-5xl">
                            Contáctanos
                        </h1>

                        <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-7 text-[#7A4E28]">
                            ¿Tienes alguna pregunta, encontraste un problema o quieres
                            compartir una sugerencia? Escríbenos y con gusto te ayudaremos.
                        </p>
                    </div>

                    <div className="mt-10 rounded-[2rem] bg-[#FFF8E7] p-6 text-center">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#FFE9AA]">
                            <Mail className="size-6 text-[#B97A22]" />
                        </div>

                        <p className="mt-4 text-xs font-black uppercase tracking-wider text-[#A47A42]">
                            Email de contacto
                        </p>

                        <a
                            href="mailto:mywishes.contacto@gmail.com"
                            className="mt-2 inline-block text-lg font-black text-[#3E260E] underline decoration-[#E8C78A] underline-offset-4 transition hover:text-[#B97A22]"
                        >
                            mywishes.contacto@gmail.com
                        </a>

                        <p className="mx-auto mt-4 max-w-lg text-sm font-semibold leading-6 text-[#8A6332]">
                            Puedes escribirnos para consultas sobre tu cuenta, eventos,
                            privacidad, soporte técnico o cualquier duda relacionada con
                            MyWishes.
                        </p>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.75rem] border border-[#E8C78A]/70 bg-white p-5">
                            <p className="font-black text-[#3E260E]">
                                Soporte
                            </p>

                            <p className="mt-2 text-sm font-semibold leading-6 text-[#7A4E28]">
                                Si algo no funciona correctamente, cuéntanos qué ocurrió y qué
                                estabas intentando hacer.
                            </p>
                        </div>

                        <div className="rounded-[1.75rem] border border-[#E8C78A]/70 bg-white p-5">
                            <p className="font-black text-[#3E260E]">
                                Privacidad
                            </p>

                            <p className="mt-2 text-sm font-semibold leading-6 text-[#7A4E28]">
                                También puedes contactarnos para consultas o solicitudes
                                relacionadas con tus datos personales.
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 border-t border-[#E8C78A]/60 pt-6 text-center">
                        <p className="text-sm font-semibold text-[#8A6332]">
                            Antes de escribirnos también puedes revisar nuestras{" "}
                            <Link
                                href="/terminos"
                                className="font-black text-[#B97A22] underline"
                            >
                                condiciones
                            </Link>{" "}
                            y nuestra{" "}
                            <Link
                                href="/privacidad"
                                className="font-black text-[#B97A22] underline"
                            >
                                política de privacidad
                            </Link>
                            .
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}