import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type AppButtonProps = ComponentProps<"button"> & {
    variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function AppButton({
    className,
    variant = "primary",
    ...props
}: AppButtonProps) {
    return (
        <button
            className={cn(
                "inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-extrabold transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200",
                variant === "primary" &&
                "bg-[#F4B42A] text-[#3B2412] shadow-[0_5px_0_#B9771F] hover:-translate-y-0.5 hover:bg-[#FFC94D]",
                variant === "secondary" &&
                "border-2 border-[#E7C37B] bg-[#FFF8E8] text-[#5A371C] hover:bg-[#FFEFC4]",
                variant === "ghost" &&
                "bg-transparent text-[#6B4A2B] hover:bg-[#FFF1C9]",
                variant === "danger" &&
                "bg-[#FF6B6B] text-white shadow-[0_5px_0_#C94242] hover:-translate-y-0.5",
                className
            )}
            {...props}
        />
    );
}

type AppLinkButtonProps = ComponentProps<typeof Link> & {
    variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function AppLinkButton({
    className,
    variant = "primary",
    ...props
}: AppLinkButtonProps) {
    return (
        <Link
            className={cn(
                "inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-extrabold transition-all duration-200",
                variant === "primary" &&
                "bg-[#F4B42A] text-[#3B2412] shadow-[0_5px_0_#B9771F] hover:-translate-y-0.5 hover:bg-[#FFC94D]",
                variant === "secondary" &&
                "border-2 border-[#E7C37B] bg-[#FFF8E8] text-[#5A371C] hover:bg-[#FFEFC4]",
                variant === "ghost" &&
                "bg-transparent text-[#6B4A2B] hover:bg-[#FFF1C9]",
                variant === "danger" &&
                "bg-[#FF6B6B] text-white shadow-[0_5px_0_#C94242] hover:-translate-y-0.5",
                className
            )}
            {...props}
        />
    );
}