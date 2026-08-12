import Link from "next/link";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[linear-gradient(180deg,#FFF8E8,#FFEFC4)] px-4 py-12 md:py-16">
            <article className="mx-auto max-w-4xl rounded-[2.5rem] border-2 border-[#E8C78A] bg-[#FFFDF7] p-6 shadow-[0_24px_70px_rgba(101,67,33,0.14)] md:p-10">
                <div className="mb-10 border-b border-[#E8C78A]/60 pb-8">
                    <Link
                        href="/"
                        className="text-sm font-black text-[#B97A22] transition hover:text-[#8A5A24]"
                    >
                        ← Volver a MyWishes
                    </Link>

                    <h1 className="mt-6 text-4xl font-black tracking-tight text-[#3E260E] md:text-5xl">
                        Términos y Condiciones
                    </h1>

                    <p className="mt-4 text-sm font-semibold text-[#8A6332]">
                        Última actualización: agosto de 2026
                    </p>

                    <p className="mt-5 text-base font-semibold leading-7 text-[#7A4E28]">
                        Estos Términos y Condiciones regulan el acceso y uso de MyWishes.
                        Al crear una cuenta o utilizar la plataforma, aceptas las
                        condiciones descritas a continuación.
                    </p>
                </div>

                <div className="space-y-10 text-[#5A371C]">
                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            1. Sobre MyWishes
                        </h2>

                        <p className="mt-4 leading-7">
                            MyWishes es una plataforma que permite crear, organizar y
                            compartir listas de regalos asociadas a eventos y ocasiones
                            especiales.
                        </p>

                        <p className="mt-4 leading-7">
                            Los usuarios pueden crear eventos, agregar regalos, compartir sus
                            listas mediante enlaces públicos y permitir que invitados
                            consulten o marquen determinados regalos como comprados o
                            reservados.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            2. Registro y cuentas
                        </h2>

                        <div className="mt-4 space-y-4 leading-7">
                            <p>
                                Para crear y administrar listas puede ser necesario registrar
                                una cuenta.
                            </p>

                            <p>
                                Eres responsable de proporcionar información correcta y de
                                mantener la confidencialidad de tus credenciales de acceso.
                            </p>

                            <p>
                                También eres responsable de las actividades realizadas desde tu
                                cuenta, salvo que nos comuniques oportunamente un acceso no
                                autorizado.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            3. Creación de eventos y listas
                        </h2>

                        <p className="mt-4 leading-7">
                            Los usuarios son responsables de la información que incorporan en
                            sus eventos, listas de regalos, descripciones, imágenes, enlaces y
                            otros campos disponibles en la plataforma.
                        </p>

                        <p className="mt-4 leading-7">
                            No debes utilizar MyWishes para publicar contenido ilegal,
                            engañoso, ofensivo, dañino, fraudulento, que vulnere derechos de
                            terceros o que infrinja la legislación aplicable.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            4. Listas públicas
                        </h2>

                        <p className="mt-4 leading-7">
                            Algunas listas pueden compartirse mediante enlaces públicos.
                            Quien crea y comparte una lista es responsable de determinar con
                            quién comparte dicho enlace y de la información que decide hacer
                            visible.
                        </p>

                        <p className="mt-4 leading-7">
                            MyWishes no garantiza que un enlace compartido permanezca
                            exclusivamente entre las personas inicialmente seleccionadas por
                            el creador del evento.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            5. Regalos, compras y reservas
                        </h2>

                        <div className="mt-4 space-y-4 leading-7">
                            <p>
                                MyWishes permite organizar y mostrar regalos, pero no actúa
                                necesariamente como vendedor, tienda ni intermediario de pago de
                                los productos mostrados en las listas.
                            </p>

                            <p>
                                Los precios, disponibilidad, condiciones de venta, envíos,
                                devoluciones, garantías y demás aspectos de una compra realizada
                                en una tienda externa son responsabilidad de dicha tienda y del
                                comprador.
                            </p>

                            <p>
                                La función para marcar un regalo como comprado o reservado tiene
                                como objetivo ayudar a evitar regalos duplicados, pero MyWishes
                                no puede garantizar que todas las acciones realizadas fuera de
                                la plataforma coincidan con la información registrada en la
                                lista.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            6. Enlaces externos
                        </h2>

                        <p className="mt-4 leading-7">
                            MyWishes puede contener enlaces a tiendas, mapas, redes sociales u
                            otros servicios administrados por terceros.
                        </p>

                        <p className="mt-4 leading-7">
                            No somos responsables del contenido, disponibilidad, políticas,
                            precios, seguridad o funcionamiento de servicios externos.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            7. Disponibilidad del servicio
                        </h2>

                        <p className="mt-4 leading-7">
                            Trabajamos para mantener MyWishes disponible y funcionando
                            correctamente. Sin embargo, pueden producirse interrupciones por
                            mantenimiento, actualizaciones, errores técnicos, proveedores
                            externos u otras circunstancias.
                        </p>

                        <p className="mt-4 leading-7">
                            No garantizamos que el servicio esté disponible de forma
                            ininterrumpida o libre de errores en todo momento.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            8. Modificaciones y nuevas funcionalidades
                        </h2>

                        <p className="mt-4 leading-7">
                            MyWishes puede modificar, añadir, reemplazar o retirar
                            funcionalidades con el objetivo de mejorar el servicio, mantener
                            su seguridad o adaptarlo a nuevas necesidades.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            9. Suspensión o eliminación
                        </h2>

                        <p className="mt-4 leading-7">
                            Podemos restringir, suspender o eliminar cuentas o contenido
                            cuando exista un uso indebido de la plataforma, incumplimiento de
                            estos términos, riesgos de seguridad, actividad fraudulenta o
                            cuando sea necesario para cumplir obligaciones legales.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            10. Propiedad intelectual
                        </h2>

                        <p className="mt-4 leading-7">
                            La marca, identidad visual, diseño, software, componentes,
                            interfaces y otros elementos propios de MyWishes se encuentran
                            protegidos por las normas aplicables y no pueden ser reproducidos,
                            distribuidos o explotados sin autorización cuando corresponda.
                        </p>

                        <p className="mt-4 leading-7">
                            Los usuarios conservan los derechos que les correspondan sobre el
                            contenido que incorporen a sus eventos y listas.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            11. Limitación de responsabilidad
                        </h2>

                        <p className="mt-4 leading-7">
                            MyWishes proporciona herramientas para organizar y compartir
                            listas de regalos. En la medida permitida por la legislación
                            aplicable, no somos responsables por compras realizadas en
                            terceros, incumplimientos de tiendas externas, pérdida de
                            oportunidades, contenido publicado por usuarios o decisiones
                            tomadas a partir de información proporcionada por terceros.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            12. Privacidad
                        </h2>

                        <p className="mt-4 leading-7">
                            El tratamiento de datos personales se encuentra descrito en
                            nuestra{" "}
                            <Link
                                href="/privacidad"
                                className="font-black text-[#B97A22] underline"
                            >
                                Política de Privacidad
                            </Link>
                            .
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            13. Cambios en estos términos
                        </h2>

                        <p className="mt-4 leading-7">
                            Podemos actualizar estos Términos y Condiciones cuando existan
                            cambios en el servicio, nuevas funcionalidades o modificaciones
                            necesarias por razones operativas o legales.
                        </p>

                        <p className="mt-4 leading-7">
                            La versión vigente estará disponible en esta página.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            14. Contacto
                        </h2>

                        <p className="mt-4 leading-7">
                            Si tienes preguntas relacionadas con estos términos puedes
                            comunicarte con nosotros mediante nuestra página de{" "}
                            <Link
                                href="/contacto"
                                className="font-black text-[#B97A22] underline"
                            >
                                contacto
                            </Link>
                            .
                        </p>
                    </section>
                </div>
            </article>
        </main>
    );
}