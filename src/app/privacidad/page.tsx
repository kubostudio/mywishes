import Link from "next/link";

export default function PrivacyPage() {
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
                        Política de Privacidad
                    </h1>

                    <p className="mt-4 text-sm font-semibold text-[#8A6332]">
                        Última actualización: agosto de 2026
                    </p>

                    <p className="mt-5 text-base font-semibold leading-7 text-[#7A4E28]">
                        En MyWishes valoramos tu privacidad. Esta Política de Privacidad
                        explica qué información podemos recopilar, cómo la utilizamos y qué
                        opciones tienes respecto de tus datos cuando utilizas nuestra
                        plataforma.
                    </p>
                </div>

                <div className="space-y-10 text-[#5A371C]">
                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            1. Información que recopilamos
                        </h2>

                        <div className="mt-4 space-y-4 leading-7">
                            <p>
                                Cuando creas una cuenta en MyWishes podemos recopilar información
                                como tu nombre, dirección de correo electrónico y los datos
                                necesarios para autenticar y administrar tu cuenta.
                            </p>

                            <p>
                                Cuando creas una lista o evento, podemos almacenar información
                                relacionada con dicho evento, incluyendo su nombre, tipo,
                                homenajeado cuando corresponda, fecha, hora, ubicación, dress
                                code, descripción, lista de regalos y otra información que
                                decidas proporcionar.
                            </p>

                            <p>
                                También podemos recopilar información técnica necesaria para el
                                correcto funcionamiento del servicio, como zona horaria,
                                información básica del navegador, registros técnicos y datos
                                relacionados con el uso de la plataforma.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            2. Información de invitados
                        </h2>

                        <div className="mt-4 space-y-4 leading-7">
                            <p>
                                Los invitados pueden acceder a listas públicas mediante un
                                enlace compartido por el creador del evento sin necesidad de
                                crear una cuenta.
                            </p>

                            <p>
                                Cuando un invitado interactúa con una lista, por ejemplo al
                                marcar un regalo como comprado o reservado, MyWishes puede
                                almacenar la información necesaria para registrar dicha acción
                                y evitar regalos duplicados.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            3. Cómo utilizamos la información
                        </h2>

                        <p className="mt-4 leading-7">
                            Utilizamos la información recopilada principalmente para:
                        </p>

                        <ul className="mt-4 list-disc space-y-2 pl-6 leading-7">
                            <li>Crear y administrar cuentas de usuario.</li>
                            <li>Crear, editar y compartir eventos y listas de regalos.</li>
                            <li>Mostrar correctamente fechas y horarios según la zona horaria.</li>
                            <li>Permitir que invitados interactúen con las listas.</li>
                            <li>Evitar reservas o compras duplicadas de regalos.</li>
                            <li>Mantener la seguridad y estabilidad de la plataforma.</li>
                            <li>Diagnosticar errores y mejorar MyWishes.</li>
                            <li>Responder consultas o solicitudes de soporte.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            4. Listas y eventos públicos
                        </h2>

                        <div className="mt-4 space-y-4 leading-7">
                            <p>
                                Las listas creadas en MyWishes pueden ser accesibles mediante
                                enlaces públicos. Esto significa que cualquier persona que tenga
                                acceso al enlace podría visualizar la información publicada en
                                dicha lista.
                            </p>

                            <p>
                                Recomendamos no incluir información sensible, confidencial o
                                innecesaria en nombres de eventos, descripciones, ubicaciones u
                                otros campos visibles públicamente.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            5. Proveedores tecnológicos
                        </h2>

                        <p className="mt-4 leading-7">
                            Para operar MyWishes podemos utilizar proveedores tecnológicos de
                            infraestructura, alojamiento, bases de datos, autenticación,
                            almacenamiento, distribución de contenido u otros servicios
                            necesarios para el funcionamiento de la plataforma.
                        </p>

                        <p className="mt-4 leading-7">
                            Estos proveedores pueden procesar información únicamente en la
                            medida necesaria para prestar sus servicios y de acuerdo con sus
                            respectivas políticas y condiciones.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            6. Enlaces a sitios externos
                        </h2>

                        <p className="mt-4 leading-7">
                            Las listas pueden contener enlaces a tiendas, mapas u otros sitios
                            externos. MyWishes no controla las prácticas de privacidad ni el
                            contenido de dichos sitios. Te recomendamos revisar sus propias
                            políticas antes de proporcionarles información.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            7. Conservación y eliminación de información
                        </h2>

                        <div className="mt-4 space-y-4 leading-7">
                            <p>
                                Conservamos la información mientras sea necesaria para brindar
                                el servicio, administrar cuentas y eventos, cumplir obligaciones
                                aplicables y mantener la seguridad de la plataforma.
                            </p>

                            <p>
                                Algunas acciones de eliminación dentro de MyWishes pueden
                                realizarse inicialmente mediante eliminación lógica, lo que
                                permite retirar el contenido de las vistas normales sin
                                eliminar inmediatamente el registro de nuestros sistemas.
                            </p>

                            <p>
                                Cuando corresponda, los usuarios podrán solicitar la eliminación
                                de su información mediante nuestros canales de contacto.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            8. Seguridad
                        </h2>

                        <p className="mt-4 leading-7">
                            Aplicamos medidas técnicas y organizativas razonables para
                            proteger la información contra accesos no autorizados, pérdida,
                            alteración o divulgación indebida. Sin embargo, ningún sistema
                            conectado a Internet puede garantizar seguridad absoluta.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            9. Tus derechos
                        </h2>

                        <p className="mt-4 leading-7">
                            Puedes solicitar información sobre tus datos personales,
                            actualización, corrección o eliminación cuando corresponda, así
                            como ejercer otros derechos reconocidos por la legislación
                            aplicable.
                        </p>

                        <p className="mt-4 leading-7">
                            Para realizar una solicitud relacionada con privacidad puedes
                            comunicarte mediante nuestros canales de contacto.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            10. Cambios en esta política
                        </h2>

                        <p className="mt-4 leading-7">
                            Podemos actualizar esta Política de Privacidad cuando MyWishes
                            incorpore nuevas funcionalidades, cambien nuestros procesos o sea
                            necesario adecuarla a nuevas obligaciones. La versión vigente
                            estará disponible siempre en esta página.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-[#3E260E]">
                            11. Contacto
                        </h2>

                        <p className="mt-4 leading-7">
                            Si tienes consultas sobre esta Política de Privacidad o sobre el
                            tratamiento de tu información, puedes comunicarte con nosotros a
                            través de la página de{" "}
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