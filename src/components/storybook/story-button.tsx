import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type Variant = "honey" | "cream" | "wood" | "danger";

type StoryButtonProps = ComponentProps<"button"> & {
    variant?: Variant;
};

export function StoryButton({
    className,
    variant = "honey",
    ...props
}: StoryButtonProps) {
    return (
        <button
            className={cn(
                "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-black transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F8D56B]/50",
                variant === "honey" &&
                "bg-[#F8C63D] text-[#3E260E] shadow-[0_5px_0_#B97A22] hover:-translate-y-0.5 hover:bg-[#FFD85F]",
                variant === "cream" &&
                "border-2 border-[#E8C78A] bg-[#FFF8E7] text-[#5A371C] hover:bg-[#FFEFC4]",
                variant === "wood" &&
                "bg-[#7A4E28] text-[#FFF8E7] shadow-[0_5px_0_#4F2F18] hover:-translate-y-0.5",
                variant === "danger" &&
                "bg-[#EF6A5B] text-white shadow-[0_5px_0_#B94439] hover:-translate-y-0.5",
                className
            )}
            {...props}
        />
    );
}

type StoryLinkButtonProps = ComponentProps<typeof Link> & {
    variant?: Variant;
};

export function StoryLinkButton({
    className,
    variant = "honey",
    ...props
}: StoryLinkButtonProps) {
    return (
        <Link
            className={cn(
                "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-black transition-all duration-200",
                variant === "honey" &&
                "bg-[#F8C63D] text-[#3E260E] shadow-[0_5px_0_#B97A22] hover:-translate-y-0.5 hover:bg-[#FFD85F]",
                variant === "cream" &&
                "border-2 border-[#E8C78A] bg-[#FFF8E7] text-[#5A371C] hover:bg-[#FFEFC4]",
                variant === "wood" &&
                "bg-[#7A4E28] text-[#FFF8E7] shadow-[0_5px_0_#4F2F18] hover:-translate-y-0.5",
                variant === "danger" &&
                "bg-[#EF6A5B] text-white shadow-[0_5px_0_#B94439] hover:-translate-y-0.5",
                className
            )}
            {...props}
        />
    );
}