"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Bee } from "@/components/storybook/decorations/bee";
import { Cloud } from "@/components/storybook/decorations/cloud";
import { Honeybarrel } from "@/components/storybook/decorations/honeybarrel";
import { Pooh } from "@/components/storybook/decorations/pooh";
import { Leaf } from "@/components/storybook/decorations/leaf";

/**
 * Decoraciones de fondo exclusivas para el Baby Shower de Alldrick.
 * Reemplaza las abejas SVG, panales y gotas de miel originales por
 * imágenes temáticas de Winnie the Pooh (abeja cartoon, nube, tarro HUNNY).
 * Mantiene nubes SVG, flores y hojas del tema Storybook original.
 */

type LayerProps = { index: number };

function MobileAlldrickLayer({ index }: LayerProps) {
    return (
        <div
            className="absolute left-0 h-[760px] w-full md:hidden"
            style={{ top: `${index * 760}px` }}
        >
            <div className="absolute -left-20 top-10 size-56 rounded-full bg-[#FFD9A8]/35 blur-3xl" />
            <div className="absolute -right-24 top-64 size-64 rounded-full bg-[#BFE8D5]/30 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 size-64 rounded-full bg-[#FFE38A]/25 blur-3xl" />

            {/* <Cloud className="left-[-12%] top-[5%] h-16 w-36 animate-cloud-drift opacity-45" />
            <Cloud className="right-[-18%] top-[38%] h-16 w-36 animate-cloud-drift-slow opacity-35" /> */}

            {/* <Bee className="left-[6%] top-[22%] h-10 w-14 animate-bee-float opacity-55" />
            <Bee className="right-[8%] top-[62%] h-10 w-14 animate-bee-float-delayed opacity-45" /> */}

            {/* <Honeybarrel className="left-[78%] top-[16%] h-10 w-8 animate-honey-drop opacity-35" /> */}
            {/* <Honeybarrel className="left-[12%] top-[72%] h-10 w-8 animate-honey-drop-delayed opacity-30" /> */}

            {/* <Pooh className="right-[8%] top-[8%] h-20 w-20 animate-honeycomb opacity-35 [--rotate:8deg]" />
            <Pooh className="left-[10%] top-[55%] h-20 w-20 animate-honeycomb opacity-35 [--rotate:-8deg]" /> */}
    
            {/* <Leaf className="left-[8%] bottom-[8%] h-10 w-10 rotate-[-12deg] opacity-28" />
            <Leaf className="right-[10%] bottom-[22%] h-10 w-10 rotate-[18deg] opacity-24" /> */}
        </div>
    );
}

function DesktopAlldrickLayer({ index }: LayerProps) {
    return (
        <div
            className="absolute left-0 hidden h-[900px] w-full md:block"
            style={{ top: `${index * 900}px` }}
        >
            <Cloud className="left-[4%] top-[82%] animate-cloud-drift opacity-70" />
            <Cloud className="right-[8%] top-[82%] animate-cloud-drift-slow opacity-70" />
            {/* <Cloud className="left-[38%] top-[8%] animate-cloud-drift opacity-35" /> */}

            <Bee className="left-[2%] top-[90%] animate-bee-float opacity-38" />
            <Bee className="left-[10%] top-[28%] animate-bee-float opacity-38" />
            <Bee className="right-[3%] top-[18%] animate-bee-float-delayed opacity-38" />
            <Bee className="right-[5%] top-[60%] animate-bee-float-delayed opacity-38" />
            <Bee className="right-[8%] top-[88%] animate-bee-float-delayed opacity-38" />
            {/* <Bee className="left-[54%] top-[18%] animate-bee-float opacity-42" /> */}
            {/* <Bee className="left-[72%] top-[70%] animate-bee-float-delayed opacity-35" /> */}

            <div className="absolute -left-20 top-10 size-72 rounded-full bg-[#FFE28A]/70 blur-3xl" />
            <div className="absolute right-0 top-16 size-80 rounded-full bg-[#FFE28A]/70 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 size-72 rounded-full bg-[#FFE28A]/60 blur-3xl" />

            <Honeybarrel className="right-[6%] top-[22%] animate-honey-drop opacity-38" />
            <Honeybarrel className="left-[10%] top-[62%] animate-honey-drop-delayed opacity-38" />
            <Honeybarrel className="left-[2%] top-[20%] animate-honey-drop-delayed opacity-38" />

            <Pooh className="right-[3%] top-[1%] h-20 w-20 animate-honey-drop opacity-38 [--rotate:8deg]" />
            <Pooh className="right-[2%] top-[32%] h-20 w-20 animate-honey-drop opacity-38 [--rotate:8deg]" />
            <Pooh className="right-[10%] top-[50%] h-20 w-20 animate-honey-drop opacity-38 [--rotate:8deg]" />
            <Pooh className="left-[4%] top-[5%] h-20 w-20 animate-honey-drop opacity-38 [--rotate:-8deg]" />
            <Pooh className="left-[8%] top-[42%] h-20 w-20 animate-honey-drop opacity-38 [--rotate:-8deg]" />
            <Pooh className="left-[1%] top-[75%] h-20 w-20 animate-honey-drop opacity-38 [--rotate:-8deg]" />

            <Leaf className="left-[8%] bottom-[10%] rotate-[-12deg] animate-bee-float opacity-38" />
            <Leaf className="left-[2%] bottom-[40%] rotate-[-12deg] animate-bee-float opacity-38" />
            <Leaf className="right-[10%] bottom-[18%] rotate-[18deg] animate-bee-float opacity-38" />
        </div>
    );
}

export function AlldrickBabyShowerDecor({
    className,
    sections = 5,
}: {
    className?: string;
    sections?: number;
}) {
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
                    <MobileAlldrickLayer index={index} />
                    <DesktopAlldrickLayer index={index} />
                </div>
            ))}
        </div>
    );
}
