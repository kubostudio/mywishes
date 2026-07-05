import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function AppCard({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "rounded-[2rem] border-2 border-[#E8C98B] bg-white shadow-[0_10px_30px_rgba(111,72,29,0.12)]",
                className
            )}
            {...props}
        />
    );
}