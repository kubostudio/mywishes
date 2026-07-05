import { cn } from "@/lib/utils";

export function Flower({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 90 90"
            className={cn("absolute h-16 w-16", className)}
            fill="none"
            aria-hidden="true"
        >
            <circle cx="45" cy="45" r="10" fill="#F8C63D" />
            <ellipse cx="45" cy="22" rx="10" ry="17" fill="#FFD9E2" />
            <ellipse cx="45" cy="68" rx="10" ry="17" fill="#FFD9E2" />
            <ellipse cx="22" cy="45" rx="17" ry="10" fill="#FFD9E2" />
            <ellipse cx="68" cy="45" rx="17" ry="10" fill="#FFD9E2" />
            <ellipse cx="29" cy="29" rx="10" ry="15" transform="rotate(-45 29 29)" fill="#FFD9E2" />
            <ellipse cx="61" cy="29" rx="10" ry="15" transform="rotate(45 61 29)" fill="#FFD9E2" />
            <ellipse cx="29" cy="61" rx="10" ry="15" transform="rotate(45 29 61)" fill="#FFD9E2" />
            <ellipse cx="61" cy="61" rx="10" ry="15" transform="rotate(-45 61 61)" fill="#FFD9E2" />
        </svg>
    );
}