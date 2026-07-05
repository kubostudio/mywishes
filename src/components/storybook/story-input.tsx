import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function StoryInput({ className, ...props }: ComponentProps<"input">) {
    return (
        <input
            className={cn(
                "h-12 w-full rounded-full border-2 border-[#E8C78A] bg-[#FFFDF7] px-5 text-sm font-bold text-[#4A2D16] outline-none placeholder:text-[#A47A42]",
                "focus:border-[#F8C63D] focus:ring-4 focus:ring-[#F8D56B]/35",
                className
            )}
            {...props}
        />
    );
}