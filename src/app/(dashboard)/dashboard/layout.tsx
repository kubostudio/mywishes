import Link from "next/link";
import { Gift, Sparkles } from "lucide-react";

import { LogoutButton } from "@/features/auth/components/logout-button";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#FFF8E8,#FFEFC4)]">
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -left-24 top-10 size-80 rounded-full bg-[#FFD9E2]/70 blur-3xl" />
                <div className="absolute right-0 top-24 size-96 rounded-full bg-[#BDEBFF]/70 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 size-96 rounded-full bg-[#FFE28A]/60 blur-3xl" />
            </div>

            <header className="sticky top-0 z-40 border-b-2 border-[#F1D7A5] bg-[#FFF8E8]/85 backdrop-blur-xl">
                <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-[1.35rem] bg-[#F4B42A] text-[#3B2412] shadow-[0_5px_0_#B9771F]">
                            <Gift className="size-6" />
                        </div>

                        <div>
                            <p className="text-2xl font-black leading-none text-[#3B2412]">
                                MyWishes
                            </p>
                            <p className="mt-1 text-xs font-extrabold text-[#8A6332]">
                                listas hechas con cariño
                            </p>
                        </div>
                    </Link>

                    <nav className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="hidden h-11 items-center rounded-full border-2 border-[#E7C37B] bg-white px-5 text-sm font-extrabold text-[#5A371C] transition hover:bg-[#FFF1C9] md:inline-flex"
                        >
                            Mis eventos
                        </Link>

                        <div className="hidden h-11 items-center gap-2 rounded-full bg-[#FFE9AA] px-4 text-sm font-extrabold text-[#5A371C] md:flex">
                            <Sparkles className="size-4 text-[#C78A21]" />
                            Fiesta lista
                        </div>

                        <LogoutButton />
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        </div>
    );
}