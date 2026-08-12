import Link from "next/link";
import Image from "next/image";
import {
  CalendarHeart,
  Gift,
  HeartHandshake,
  ListChecks,
  PartyPopper,
  Share2,
  Sparkles, 
  TabletSmartphone,
} from "lucide-react";

import { StoryBadge } from "@/components/storybook/story-badge";
import { StoryCard } from "@/components/storybook/story-card";
import { StoryLinkButton } from "@/components/storybook/story-button";
import { Faqs } from "@/components/landing/Faqs";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { Reveal } from "@/components/ui/reveal";

export default function HomePage() {
  return (
    <>
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#FFF8E8,#FFEFC4)]">

      <div className="relative z-10">
        <header className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center relative h-[48px] w-[48px] overflow-visible">
              <Image
                src="/logo2.svg"
                alt="MyWishes"
                width={220}
                height={220}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                priority
              />
            </div>

            <div>
              <p className="text-2xl font-bold leading-none text-[#3E260E]">
                MyWishes
              </p>
              <p className="mt-1 text-xs font-bold text-[#7A4E28]">
                listas hechas con cariño
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-bold text-[#5A371C] hover:bg-[#FFF1B8] sm:inline-flex"
            >
              Ingresar
            </Link>

            <StoryLinkButton href="/register">Crear lista</StoryLinkButton>
          </nav>
        </header>

        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-20">
          <div>
            <Reveal>
              <StoryBadge>
                <Sparkles className="mr-2 size-4" />
                Para baby showers, cumpleaños y momentos especiales
              </StoryBadge>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-[0.95] tracking-tight text-[#3E260E] md:text-7xl">
                La forma más fácil de crear y compartir tu lista de regalos.
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-6 max-w-2xl text-xl font-bold leading-8 text-[#7A4E28]">
                Crea listas de regalos para cumpleaños, Navidad, baby showers o cualquier ocasión especial. Compártelas con un solo enlace.
              </p>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <StoryLinkButton href="/register" className="h-14 px-8 text-base">
                  Crear mi lista gratis
                </StoryLinkButton>

                <StoryLinkButton
                  href="/login"
                  variant="cream"
                  className="h-14 px-8 text-base"
                >
                  Ya tengo cuenta
                </StoryLinkButton>
              </div>
            </Reveal>
          </div>

          <Reveal delay={180}>
            <StoryCard className="relative overflow-hidden p-6 transition-all duration-500 hover:-translate-y-1 hover:rotate-[0.3deg] hover:shadow-[0_22px_50px_rgba(111,72,29,0.16)] md:p-8">
              <div className="absolute -right-10 -top-10 size-32 rounded-full bg-[#FFD9E2]" />
              <div className="absolute -bottom-12 left-12 size-40 rounded-full bg-[#FFE38A]" />

              <div className="relative">
                <div className="mb-6 inline-flex rounded-full bg-[#FFF1B8] px-4 py-2 text-sm font-black text-[#5A371C]">
                  Baby Shower Mateo
                </div>

                <div className="space-y-4">
                  {[
                    ["Coche de bebé", "PEN 399.00"],
                    ["Peluche suave", "PEN 79.90"],
                    ["Set de pañales", "PEN 120.00"],
                  ].map(([name, price]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between rounded-[1.5rem] bg-[#FFF8E7] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#FFE9AA]">
                          <Gift className="size-5 text-[#B97A22]" />
                        </div>
                        <div>
                          <p className="font-black text-[#3E260E]">{name}</p>
                          <p className="text-sm font-bold text-[#7A4E28]">
                            Disponible
                          </p>
                        </div>
                      </div>

                      <p className="font-black text-[#5A371C]">{price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </StoryCard>
          </Reveal>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <Reveal delay={220}>
              <StoryCard className="grid gap-8 p-8 md:grid-cols-[0.9fr_1.1fr] md:p-10 ransition-all duration-500 hover:-translate-y-1 hover:rotate-[0.3deg] hover:shadow-[0_22px_50px_rgba(111,72,29,0.16)]">
              <div>
                <StoryBadge>
                  <PartyPopper className="mr-2 size-4" />
                  Pensado para invitados
                </StoryBadge>

                <h2 className="mt-5 text-4xl font-bold leading-tight text-[#3E260E] md:text-5xl">
                  Tus invitados solo abren el enlace y eligen.
                </h2>

                <p className="mt-4 text-lg font-semibold leading-8 text-[#7A4E28]">
                  No necesitan crear cuenta. Pueden ver los regalos, comprar en la
                  tienda y marcar lo que ya compraron.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  "Sin registro para invitados",
                  "Evita regalos repetidos",
                  "Compatible con cualquier tienda",
                  "Ideal para compartir por redes sociales",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-[1.5rem] bg-[#FFF8E7] p-4"
                  >
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#EFFFF7]">
                      <HeartHandshake className="size-5 text-[#2F6B4F]" />
                    </div>
                    <p className="font-black text-[#3E260E]">{item}</p>
                  </div>
                ))}
              </div>
            </StoryCard>
          </Reveal>

        </section>

        <section className="mx-auto max-w-4xl px-4 py-16 text-center">
          <Reveal delay={220}>
            <h2 className="text-4xl font-bold leading-tight text-[#3E260E] md:text-5xl">
              Empieza preparando una lista especial.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold leading-8 text-[#7A4E28]">
              Crea tu evento, agrega regalos y comparte una lista bonita con las
              personas que quieres.
            </p>

            <div className="mt-8">
              <StoryLinkButton href="/register" className="h-14 px-10 text-base">
                Crear mi lista gratis
              </StoryLinkButton>
            </div>
          </Reveal>
        </section>
      </div>

      <HowItWorks />

      <Testimonials />

      <Faqs />
    </main>

    <footer className="bg-[#5F4B32] px-6 py-14 text-[#FFEFC4]">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <h2 className="text-2xl font-extrabold">MyWishes</h2>
          <p className="mt-4 max-w-sm leading-7 text-[#F6E3B8]">
            Crea, organiza y comparte listas de regalos para baby showers,
            cumpleaños y momentos especiales.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-white">Producto</h3>
          <ul className="mt-4 space-y-3 text-[#F6E3B8]">
            <li><Link href="/login">Crear lista</Link></li>
            <li><Link href="#como-funciona">Cómo funciona</Link></li>
            <li><Link href="#faq">Preguntas frecuentes</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-white">Ocasiones</h3>
          <ul className="mt-4 space-y-3 text-[#F6E3B8]">
            <li>Baby shower</li>
            <li>Cumpleaños</li>
            <li>Navidad</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-white">Legal</h3>
          <ul className="mt-4 space-y-3 text-[#F6E3B8]">
            <li><Link href="/privacidad">Privacidad</Link></li>
            <li><Link href="/terminos">Términos</Link></li>
            <li><Link href="/contacto">Contacto</Link></li>
          </ul>
        </div>
      </div>

        <div className="mx-auto mt-12 max-w-6xl border-t border-[#7A6548] pt-6 text-center">
          <p className="text-sm text-[#F6E3B8]">
            © 2026 MyWishes. Todos los derechos reservados.
          </p>

          <p className="mt-5 text-xs font-semibold text-[#DCC79D]">
            Hecho con cariño por{" "}
            <a
              href="https://www.instagram.com/kubo_std/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-black text-[#FFEFC4] transition hover:text-white"
            >
              KUBOstudio
            </a>
          </p>
        </div>
    </footer>
    </>
  );
}