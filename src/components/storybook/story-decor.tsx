import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Bee } from "@/components/storybook/decorations/bee";
import { Cloud } from "@/components/storybook/decorations/cloud";
import { Flower } from "@/components/storybook/decorations/flower";
import { HoneyDrop } from "@/components/storybook/decorations/honey-drop";
import { Honeycomb } from "@/components/storybook/decorations/honeycomb";
import { Leaf } from "@/components/storybook/decorations/leaf";

type ForestDecorProps = {
    className?: string;
    sections?: number;
};

const layers = [
    {
        clouds: [
            "left-[4%] top-[4%] opacity-70",
            "right-[8%] top-[14%] opacity-50",
        ],
        bees: [
            "left-[12%] top-[28%] opacity-70",
            "right-[16%] top-[42%] opacity-60",
            "left-[54%] top-[18%] opacity-45",
        ],
        drops: [
            "right-[34%] top-[32%] opacity-45",
            "left-[22%] top-[62%] opacity-30",
        ],
        honeycombs: [
            "right-[6%] top-[6%] opacity-28 [--rotate:8deg]",
            "left-[6%] top-[68%] opacity-18 [--rotate:-8deg]",
        ],
        nature: [
            <Leaf key="leaf-1" className="left-[8%] bottom-[10%] rotate-[-12deg] opacity-35" />,
            <Flower key="flower-1" className="right-[24%] bottom-[8%] opacity-35" />,
        ],
    },
    {
        clouds: [
            "left-[35%] top-[8%] opacity-45",
            "right-[3%] top-[48%] opacity-35",
        ],
        bees: [
            "left-[20%] top-[18%] opacity-55",
            "right-[26%] top-[26%] opacity-50",
            "left-[68%] top-[70%] opacity-40",
        ],
        drops: [
            "left-[10%] top-[45%] opacity-30",
            "right-[18%] top-[72%] opacity-36",
            "left-[45%] top-[84%] opacity-24",
        ],
        honeycombs: [
            "left-[5%] top-[12%] opacity-20 [--rotate:-10deg]",
            "right-[30%] top-[58%] opacity-18 [--rotate:4deg]",
        ],
        nature: [
            <Leaf key="leaf-2" className="right-[10%] bottom-[18%] rotate-[18deg] opacity-32" />,
            <Flower key="flower-2" className="left-[30%] bottom-[7%] opacity-28" />,
        ],
    },
    {
        clouds: [
            "left-[8%] top-[18%] opacity-42",
            "right-[24%] top-[6%] opacity-50",
        ],
        bees: [
            "left-[42%] top-[20%] opacity-55",
            "right-[10%] top-[38%] opacity-58",
            "left-[14%] top-[74%] opacity-40",
        ],
        drops: [
            "right-[42%] top-[16%] opacity-28",
            "left-[32%] top-[50%] opacity-34",
            "right-[12%] top-[78%] opacity-26",
        ],
        honeycombs: [
            "right-[8%] top-[10%] opacity-22 [--rotate:12deg]",
            "left-[14%] top-[58%] opacity-16 [--rotate:-4deg]",
        ],
        nature: [
            <Leaf key="leaf-3" className="left-[4%] bottom-[18%] rotate-[10deg] opacity-28" />,
            <Flower key="flower-3" className="right-[34%] bottom-[10%] opacity-30" />,
        ],
    },
];

function ForestLayer({ index }: { index: number }) {
    const layer = layers[index % layers.length];

    return (
        <div
            className="absolute left-0 h-[900px] w-full"
            style={{ top: `${index * 900}px` }}
        >
            <div className="absolute -left-24 top-10 size-80 rounded-full bg-[#FFD9A8]/35 blur-3xl" />
            <div className="absolute -right-20 top-24 size-96 rounded-full bg-[#BFE8D5]/30 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 size-96 rounded-full bg-[#FFE38A]/28 blur-3xl" />

            {layer.clouds.map((className, itemIndex) => (
                <Cloud
                    key={`cloud-${index}-${itemIndex}`}
                    className={cn(
                        itemIndex % 2 === 0 ? "animate-cloud-drift" : "animate-cloud-drift-slow",
                        className
                    )}
                />
            ))}

            {layer.bees.map((className, itemIndex) => (
                <Bee
                    key={`bee-${index}-${itemIndex}`}
                    className={cn(
                        itemIndex % 2 === 0 ? "animate-bee-float" : "animate-bee-float-delayed",
                        className
                    )}
                />
            ))}

            {layer.drops.map((className, itemIndex) => (
                <HoneyDrop
                    key={`drop-${index}-${itemIndex}`}
                    className={cn(
                        itemIndex % 2 === 0 ? "animate-honey-drop" : "animate-honey-drop-delayed",
                        className
                    )}
                />
            ))}

            {layer.honeycombs.map((className, itemIndex) => (
                <Honeycomb
                    key={`honeycomb-${index}-${itemIndex}`}
                    className={cn("animate-honeycomb", className)}
                />
            ))}

            {layer.nature}
        </div>
    );
}

export function ForestDecor({ className, sections = 5 }: ForestDecorProps) {
    return (
        <div
            aria-hidden="true"
            className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
        >
            {Array.from({ length: sections }).map((_, index) => (
                <ForestLayer key={index} index={index} />
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