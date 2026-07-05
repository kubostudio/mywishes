import { cn } from "@/lib/utils";

export function HoneyBackground({ className }: { className?: string }) {
    return (
        <div
            aria-hidden="true"
            className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}
        >
            <div className="absolute -left-24 top-10 size-80 rounded-full bg-[#FFD9A8]/70 blur-3xl" />
            <div className="absolute right-0 top-24 size-96 rounded-full bg-[#BFE8D5]/70 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 size-96 rounded-full bg-[#FFE38A]/60 blur-3xl" />

            <div className="absolute left-[8%] top-[18%] text-5xl opacity-20">🍯</div>
            <div className="absolute right-[12%] top-[30%] text-4xl opacity-20">🐝</div>
            <div className="absolute left-[18%] bottom-[18%] text-4xl opacity-20">🌿</div>
            <div className="absolute right-[22%] bottom-[12%] text-5xl opacity-20">🎈</div>
        </div>
    );
}

export function SectionEyebrow({ children }: { children: React.ReactNode }) {
    return (
        <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#FFF1B8] px-4 py-1.5 text-xs font-black uppercase tracking-wide text-[#7A4E28]">
            <span>🐝</span>
            {children}
        </p>
    );
}