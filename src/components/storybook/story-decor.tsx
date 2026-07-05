import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Bee } from "@/components/storybook/decorations/bee";
import { Cloud } from "@/components/storybook/decorations/cloud";
import { Flower } from "@/components/storybook/decorations/flower";
import { HoneyDrop } from "@/components/storybook/decorations/honey-drop";
import { Leaf } from "@/components/storybook/decorations/leaf";
import { Honeycomb } from "@/components/storybook/decorations/honeycomb";


export function ForestDecor({ className }: { className?: string }) {
    return (
        <div
            aria-hidden="true"
            className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
        >
            <div className="absolute -left-24 top-10 size-80 rounded-full bg-[#FFD9A8]/55 blur-3xl" />
            <div className="absolute -right-20 top-24 size-96 rounded-full bg-[#BFE8D5]/50 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 size-96 rounded-full bg-[#FFE38A]/45 blur-3xl" />

            <Cloud className="left-[5%] top-[8%] animate-cloud-drift opacity-70" />
            <Cloud className="right-[8%] top-[18%] animate-cloud-drift-slow opacity-55" />
            <Cloud className="left-[38%] top-[4%] animate-cloud-drift opacity-45" />

            <Bee className="left-[8%] top-[28%] animate-bee-float opacity-75" />
            <Bee className="left-[20%] top-[52%] animate-bee-float-delayed opacity-55" />
            <Bee className="right-[12%] top-[34%] animate-bee-float opacity-70" />
            <Bee className="right-[26%] top-[58%] animate-bee-float-delayed opacity-50" />
            <Bee className="left-[48%] top-[22%] animate-bee-float opacity-45" />
            <Bee className="left-[62%] bottom-[18%] animate-bee-float-delayed opacity-40" />

            <HoneyDrop className="right-[35%] top-[30%] animate-honey-drop opacity-50" />
            <HoneyDrop className="left-[14%] top-[42%] animate-honey-drop-delayed opacity-35" />
            <HoneyDrop className="right-[18%] bottom-[25%] animate-honey-drop opacity-40" />
            <HoneyDrop className="left-[42%] bottom-[12%] animate-honey-drop-delayed opacity-30" />
            <HoneyDrop className="right-[44%] top-[12%] animate-honey-drop opacity-25" />

            <Honeycomb className="right-[7%] top-[8%] animate-honeycomb opacity-35 [--rotate:8deg]" />
            <Honeycomb className="left-[5%] bottom-[28%] animate-honeycomb opacity-20 [--rotate:-10deg]" />
            <Honeycomb className="right-[30%] bottom-[18%] animate-honeycomb opacity-18 [--rotate:4deg]" />

            <Leaf className="left-[8%] bottom-[12%] rotate-[-12deg] opacity-45" />
            <Leaf className="right-[10%] bottom-[18%] rotate-[18deg] opacity-40" />
            <Flower className="left-[22%] bottom-[8%] opacity-50" />
            <Flower className="right-[28%] bottom-[10%] opacity-45" />
        </div>
    );
}

export function ForestShell({ children }: { children: ReactNode }) {
    return (
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#FFF7DF]">
            <ForestDecor />
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