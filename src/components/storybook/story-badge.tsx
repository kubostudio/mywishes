import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function StoryBadge({ className, ...props }: ComponentProps<"span">) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border-2 border-[#E8C78A] bg-[#FFF1B8] px-4 py-1.5 text-xs font-black text-[#5A371C]",
                className
            )}
            {...props}
        />
    );
}