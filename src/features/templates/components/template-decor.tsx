import { cn } from "@/lib/utils";
import { ForestDecor } from "@/components/storybook/story-decor";
import type { TemplateDecorStyle } from "../types";

type TemplateDecorProps = {
    templateId?: string;
    decorStyle?: TemplateDecorStyle;
    className?: string;
    sections?: number;
};

// --- Pastel Bubbles / Clouds Layer ---
function BabyPastelLayer({ index }: { index: number }) {
    return (
        <div
            className="absolute left-0 h-[850px] w-full"
            style={{ top: `${index * 850}px` }}
        >
            <div className="absolute -left-20 top-10 size-72 rounded-full bg-pink-300/25 blur-3xl" />
            <div className="absolute -right-20 top-60 size-80 rounded-full bg-sky-200/30 blur-3xl" />
            <div className="absolute bottom-10 left-1/3 size-64 rounded-full bg-amber-100/30 blur-3xl" />

            {/* Pastel orbs / bubbles */}
            <div className="absolute left-[12%] top-[20%] size-12 rounded-full border border-pink-300/30 bg-pink-100/20 shadow-sm" />
            <div className="absolute right-[15%] top-[35%] size-16 rounded-full border border-sky-300/30 bg-sky-100/20 shadow-sm" />
            <div className="absolute left-[28%] bottom-[20%] size-8 rounded-full border border-amber-300/30 bg-amber-100/20 shadow-sm" />
            <div className="absolute right-[25%] bottom-[12%] size-10 rounded-full border border-purple-200/30 bg-purple-100/20 shadow-sm" />

            <span className="absolute left-[8%] top-[68%] text-pink-300/40 text-xl">☁</span>
            <span className="absolute right-[8%] top-[16%] text-sky-300/40 text-2xl">☁</span>
        </div>
    );
}

// --- Sparkles & Gold Layer ---
function SparklesLayer({ index }: { index: number }) {
    return (
        <div
            className="absolute left-0 h-[850px] w-full"
            style={{ top: `${index * 850}px` }}
        >
            <div className="absolute -left-24 top-16 size-80 rounded-full bg-amber-200/20 blur-3xl" />
            <div className="absolute -right-20 top-72 size-96 rounded-full bg-yellow-100/25 blur-3xl" />
            <div className="absolute bottom-12 left-1/3 size-72 rounded-full bg-amber-100/20 blur-3xl" />

            {/* Sparkle glimmers */}
            <span className="absolute left-[14%] top-[22%] text-sm text-amber-500/40 animate-pulse">✦</span>
            <span className="absolute right-[20%] top-[32%] text-base text-yellow-600/35 animate-pulse">✧</span>
            <span className="absolute left-[35%] top-[70%] text-xs text-amber-400/45 animate-pulse">✦</span>
            <span className="absolute right-[12%] bottom-[20%] text-sm text-yellow-500/35 animate-pulse">✧</span>

            {/* Subtle rings */}
            <div className="absolute right-[10%] top-[8%] size-40 rounded-full border border-amber-400/15" />
            <div className="absolute left-[6%] bottom-[14%] size-32 rounded-full border border-yellow-500/15" />
        </div>
    );
}

// --- Celestial Sky / Baptism Layer ---
function BaptismSkyLayer({ index }: { index: number }) {
    return (
        <div
            className="absolute left-0 h-[850px] w-full"
            style={{ top: `${index * 850}px` }}
        >
            <div className="absolute -left-20 top-10 size-80 rounded-full bg-sky-300/20 blur-3xl" />
            <div className="absolute -right-20 top-60 size-80 rounded-full bg-amber-100/20 blur-3xl" />
            <div className="absolute bottom-10 left-1/3 size-72 rounded-full bg-sky-200/20 blur-3xl" />

            {/* Cloud and halo glimmers */}
            <span className="absolute left-[12%] top-[18%] text-2xl text-sky-300/30">☁</span>
            <span className="absolute right-[16%] top-[30%] text-xl text-sky-200/30">☁</span>
            <span className="absolute left-[25%] top-[70%] text-sm text-sky-400/35 animate-pulse">✦</span>
            <span className="absolute right-[28%] bottom-[16%] text-xs text-amber-400/40 animate-pulse">✧</span>
        </div>
    );
}

// --- Snow & Winter Layer ---
function SnowLayer({ index }: { index: number }) {
    return (
        <div
            className="absolute left-0 h-[850px] w-full"
            style={{ top: `${index * 850}px` }}
        >
            <div className="absolute -left-20 top-12 size-72 rounded-full bg-emerald-700/15 blur-3xl" />
            <div className="absolute -right-20 top-64 size-80 rounded-full bg-red-600/15 blur-3xl" />
            <div className="absolute bottom-8 left-1/3 size-72 rounded-full bg-amber-400/10 blur-3xl" />

            {/* Snowflakes and sparks */}
            <span className="absolute left-[14%] top-[20%] text-sm text-emerald-100/35">❄</span>
            <span className="absolute right-[18%] top-[32%] text-base text-white/30">❄</span>
            <span className="absolute left-[30%] top-[65%] text-xs text-amber-300/45 animate-pulse">✦</span>
            <span className="absolute right-[15%] bottom-[18%] text-sm text-red-200/30">❄</span>
        </div>
    );
}

export function TemplateDecor({
    templateId = "storybook",
    decorStyle,
    className,
    sections = 5,
}: TemplateDecorProps) {
    // Custom theme branch
    if (templateId === "custom") {
        if (!decorStyle || decorStyle === "none") {
            return null;
        }
        if (decorStyle === "forest") {
            return <ForestDecor className={className} sections={sections} />;
        }
        return (
            <div
                aria-hidden="true"
                className={cn(
                    "pointer-events-none absolute inset-0 overflow-hidden",
                    className
                )}
            >
                {Array.from({ length: sections }).map((_, index) => {
                    switch (decorStyle) {
                        case "sparkles":
                            return <SparklesLayer key={index} index={index} />;
                        case "bubbles":
                            return <BabyPastelLayer key={index} index={index} />;
                        case "snow":
                            return <SnowLayer key={index} index={index} />;
                        default:
                            return null;
                    }
                })}
            </div>
        );
    }

    // Storybook theme
    if (templateId === "storybook") {
        return <ForestDecor className={className} sections={sections} />;
    }

    const renderLayer = (index: number) => {
        switch (templateId) {
            case "baby_pastel":
                return <BabyPastelLayer key={index} index={index} />;
            case "wedding_gold":
                return <SparklesLayer key={index} index={index} />;
            case "baptism_sky":
                return <BaptismSkyLayer key={index} index={index} />;
            case "christmas_magic":
                return <SnowLayer key={index} index={index} />;
            default:
                return null;
        }
    };

    return (
        <div
            aria-hidden="true"
            className={cn(
                "pointer-events-none absolute inset-0 overflow-hidden",
                className
            )}
        >
            {Array.from({ length: sections }).map((_, index) => renderLayer(index))}
        </div>
    );
}
