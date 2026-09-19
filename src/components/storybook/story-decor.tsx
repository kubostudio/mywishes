import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Bee } from "@/components/storybook/decorations/bee";
import { Cloud } from "@/components/storybook/decorations/cloud";
// import { HoneyDrop } from "@/components/storybook/decorations/honey-drop";
import { Honeybarrel } from "@/components/storybook/decorations/honeybarrel";
import { Leaf } from "@/components/storybook/decorations/leaf";

type ForestDecorProps = {
    className?: string;
    sections?: number;
};

function MobileForestLayer({ index }: { index: number }) {
    return (
        <div
            className="absolute left-0 h-[760px] w-full md:hidden"
            style={{ top: `${index * 760}px` }}
        >
            <div className="absolute -left-20 top-10 size-56 rounded-full bg-[#FFD9A8]/35 blur-3xl" />
            <div className="absolute -right-24 top-64 size-64 rounded-full bg-[#BFE8D5]/30 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 size-64 rounded-full bg-[#FFE38A]/25 blur-3xl" />

            <Cloud className="left-[-12%] top-[5%] h-16 w-36 animate-cloud-drift opacity-45" />
            <Cloud className="right-[-18%] top-[38%] h-16 w-36 animate-cloud-drift-slow opacity-35" />

            <Bee className="left-[6%] top-[22%] h-10 w-14 animate-bee-float opacity-55" />
            <Bee className="right-[8%] top-[62%] h-10 w-14 animate-bee-float-delayed opacity-45" />

            <Honeybarrel className="left-[78%] top-[16%] h-10 w-8 animate-honey-drop opacity-35" />
            <Honeybarrel className="left-[12%] top-[72%] h-10 w-8 animate-honey-drop-delayed opacity-30" />

            {/* <Honeycomb className="right-[-8%] top-[8%] h-20 w-20 animate-honeycomb opacity-18 [--rotate:8deg]" />
            <Honeycomb className="left-[-10%] top-[55%] h-20 w-20 animate-honeycomb opacity-14 [--rotate:-8deg]" /> */}

            <Leaf className="left-[8%] bottom-[8%] h-10 w-10 rotate-[-12deg] opacity-28" />
            <Leaf className="right-[10%] bottom-[22%] h-10 w-10 rotate-[18deg] opacity-24" />

            {/* <Flower className="left-[18%] top-[42%] h-10 w-10 opacity-30" />
            <Flower className="right-[18%] bottom-[8%] h-10 w-10 opacity-25" /> */}
        </div>
    );
}

function DesktopForestLayer({ index }: { index: number }) {
    return (
        <div
            className="absolute left-0 hidden h-[900px] w-full md:block"
            style={{ top: `${index * 900}px` }}
        >
            {/* <div className="absolute -left-24 top-10 size-80 rounded-full bg-[#FFD9A8]/35 blur-3xl" /> */}
            {/* <div className="absolute -right-20 top-24 size-96 rounded-full bg-[#BFE8D5]/30 blur-3xl" /> */}
            {/* <div className="absolute bottom-0 left-1/3 size-96 rounded-full bg-[#FFE38A]/28 blur-3xl" /> */}

            <Cloud className="left-[4%] top-[4%] animate-cloud-drift opacity-30" />
            <Cloud className="right-[8%] top-[14%] animate-cloud-drift-slow opacity-35" />
            {/* <Cloud className="left-[38%] top-[8%] animate-cloud-drift opacity-35" /> */}

            <Bee className="left-[12%] top-[28%] animate-bee-float opacity-35" />
            <Bee className="right-[16%] top-[42%] animate-bee-float-delayed opacity-35" />
            {/* <Bee className="left-[54%] top-[18%] animate-bee-float opacity-42" /> */}
            {/* <Bee className="left-[72%] top-[70%] animate-bee-float-delayed opacity-35" /> */}

            <Honeybarrel className="right-[6%] top-[22%] animate-honey-drop opacity-38" />
            <Honeybarrel className="left-[12%] top-[62%] animate-honey-drop-delayed opacity-26" />
            {/* <Honeybarrel className="right-[12%] top-[76%] animate-honey-drop opacity-26" /> */}

            {/* <Honeycomb className="right-[6%] top-[6%] animate-honeycomb opacity-24 [--rotate:8deg]" />
            <Honeycomb className="left-[6%] top-[68%] animate-honeycomb opacity-16 [--rotate:-8deg]" />
            <Honeycomb className="right-[30%] top-[58%] animate-honeycomb opacity-14 [--rotate:4deg]" /> */}

            <Leaf className="left-[8%] bottom-[10%] rotate-[-12deg] opacity-32" />
            <Leaf className="right-[10%] bottom-[18%] rotate-[18deg] opacity-28" />
            {/* <Flower className="right-[24%] bottom-[8%] opacity-30" />
            <Flower className="left-[30%] bottom-[7%] opacity-25" /> */}
        </div>
    );
}

export function ForestDecor({ className, sections = 5 }: ForestDecorProps) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                "pointer-events-none absolute inset-0 overflow-hidden",
                className
            )}
        >
            {Array.from({ length: sections }).map((_, index) => (
                <div key={index}>
                    <MobileForestLayer index={index} />
                    <DesktopForestLayer index={index} />
                </div>
            ))}
        </div>
    );
}

export function ForestShell({ children }: { children: ReactNode }) {
    return (
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#FFF7DF]">
            <ForestDecor sections={2} />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

export function ForestDivider() {
    return (
        <div className="my-8 flex items-center gap-3">
            <div className="h-1 flex-1 rounded-full bg-[#E8C78A]" />
            <span className="text-2xl">🐝</span>
            <div className="h-1 flex-1 rounded-full bg-[#E8C78A]" />
        </div>
    );
}