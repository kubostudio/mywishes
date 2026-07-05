import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function AppBadge({ className, ...props }: ComponentProps<"span">) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full bg-[#FFE9AA] px-3 py-1 text-xs font-extrabold text-[#5A371C]",
                className
            )}
            {...props}
        />
    );
}