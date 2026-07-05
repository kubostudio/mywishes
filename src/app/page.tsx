import Link from "next/link";
import {
  CalendarHeart,
  Gift,
  HeartHandshake,
  ListChecks,
  PartyPopper,
  Share2,
  Sparkles,
} from "lucide-react";

import { StoryBadge } from "@/components/storybook/story-badge";
import { StoryCard } from "@/components/storybook/story-card";
import { StoryLinkButton } from "@/components/storybook/story-button";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#FFF8E8,#FFEFC4)]">

      <div className="relative z-10">
        <header className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-[1.35rem] bg-[#F8C63D] text-[#3E260E] shadow-[0_5px_0_#B97A22]">
              <Gift className="size-6" />
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
            <StoryBadge>
              <Sparkles className="mr-2 size-4" />
              Para baby showers, cumpleaños y momentos especiales
            </StoryBadge>

            <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-[0.95] tracking-tight text-[#3E260E] md:text-7xl">
              Crea una lista de regalos linda, simple y fácil de compartir.
            </h1>

            <p className="mt-6 max-w-2xl text-xl font-bold leading-8 text-[#7A4E28]">
              Agrega regalos de cualquier tienda, comparte tu enlace con tus
              invitados y evita regalos duplicados de forma sencilla.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <StoryLinkButton href="/register" className="h-14 px-8 text-base">
                Crear mi lista
              </StoryLinkButton>

              <StoryLinkButton
                href="/login"
                variant="cream"
                className="h-14 px-8 text-base"
              >
                Ya tengo cuenta
              </StoryLinkButton>
            </div>
          </div>

          <StoryCard className="relative overflow-hidden p-6 md:p-8">
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
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: CalendarHeart,
                title: "Crea tu evento",
                text: "Configura la fecha, lugar y detalles principales de tu celebración.",
              },
              {
                icon: ListChecks,
                title: "Agrega regalos",
                text: "Incluye regalos manualmente o pegando enlaces de tiendas online.",
              },
              {
                icon: Share2,
                title: "Comparte tu lista",
                text: "Envía el enlace o QR para que tus invitados elijan sin registrarse.",
              },
            ].map((item) => (
              <StoryCard key={item.title} className="p-6">
                <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-[#FFF1B8]">
                  <item.icon className="size-7 text-[#B97A22]" />
                </div>

                <h3 className="text-2xl font-bold text-[#3E260E]">
                  {item.title}
                </h3>

                <p className="mt-3 text-base font-semibold leading-7 text-[#7A4E28]">
                  {item.text}
                </p>
              </StoryCard>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <StoryCard className="grid gap-8 p-8 md:grid-cols-[0.9fr_1.1fr] md:p-10">
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
                "Ideal para compartir por WhatsApp",
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
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16 text-center">
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
        </section>
      </div>
    </main>
  );
}