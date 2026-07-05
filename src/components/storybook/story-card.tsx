import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function StoryCard({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "rounded-[2.25rem] border-2 border-[#E8C78A] bg-[#FFFDF7] shadow-[0_16px_40px_rgba(101,67,33,0.12)]",
                className
            )}
            {...props}
        />
    );
}