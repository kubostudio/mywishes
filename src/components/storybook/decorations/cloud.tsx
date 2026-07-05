import { cn } from "@/lib/utils";

export function Cloud({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 220 100"
            className={cn("absolute h-24 w-52 text-white/70", className)}
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M63 75C37 75 20 61 20 43c0-17 15-30 34-30 12 0 23 5 29 14C92 11 109 3 128 7c22 5 37 22 37 43h7c18 0 28 10 28 23 0 14-13 22-31 22H63Z"
                fill="currentColor"
            />
        </svg>
    );
}