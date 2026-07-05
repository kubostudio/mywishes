import { cn } from "@/lib/utils";

export function HoneyBarrel({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 120 130"
            className={cn("absolute h-28 w-24", className)}
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M24 24c8-10 64-10 72 0v82c-8 10-64 10-72 0V24Z"
                fill="#B8792A"
                stroke="#6B3F1D"
                strokeWidth="4"
            />
            <path
                d="M24 32c12 8 60 8 72 0"
                stroke="#F3C164"
                strokeWidth="5"
                strokeLinecap="round"
            />
            <path
                d="M24 98c12-8 60-8 72 0"
                stroke="#F3C164"
                strokeWidth="5"
                strokeLinecap="round"
            />
            <path
                d="M42 26c-4 26-4 52 0 78M78 26c4 26 4 52 0 78"
                stroke="#6B3F1D"
                strokeWidth="3"
                opacity="0.45"
            />
            <path
                d="M18 44h84M18 86h84"
                stroke="#6B3F1D"
                strokeWidth="6"
                strokeLinecap="round"
            />
            <path
                d="M46 52c8-8 20-8 28 0 4 4 4 13 0 17-8 8-20 8-28 0-4-4-4-13 0-17Z"
                fill="#F8C63D"
            />
            <path
                d="M55 57c-3 3-4 7-3 11"
                stroke="#FFE38A"
                strokeWidth="4"
                strokeLinecap="round"
            />
        </svg>
    );
}