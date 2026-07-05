import { cn } from "@/lib/utils";

export function Leaf({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 90 90"
            className={cn("absolute h-16 w-16", className)}
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M74 14C45 13 18 28 13 61c26 8 55-8 61-47Z"
                fill="#8DBA75"
            />
            <path
                d="M18 67c18-21 34-34 55-51"
                stroke="#4F7A3A"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <path
                d="M39 44c-6 0-12-2-17-5M51 34c-3-5-5-10-5-16"
                stroke="#4F7A3A"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
}