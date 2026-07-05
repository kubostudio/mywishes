import { cn } from "@/lib/utils";

export function Bee({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 90 70"
            className={cn("absolute h-14 w-20", className)}
            fill="none"
            aria-hidden="true"
        >
            <ellipse cx="30" cy="24" rx="16" ry="13" fill="#F8C63D" />
            <ellipse cx="53" cy="34" rx="23" ry="17" fill="#F8C63D" />
            <path d="M42 20c3 8 3 20 0 28" stroke="#3E260E" strokeWidth="5" />
            <path d="M55 18c3 9 3 24 0 33" stroke="#3E260E" strokeWidth="5" />
            <circle cx="24" cy="21" r="3" fill="#3E260E" />
            <path d="M15 13c-5-5-8-9-12-9" stroke="#3E260E" strokeWidth="3" strokeLinecap="round" />
            <path d="M23 10c-2-6-3-9-1-13" stroke="#3E260E" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="45" cy="13" rx="13" ry="8" fill="#BFE8D5" fillOpacity=".75" />
            <ellipse cx="60" cy="16" rx="13" ry="8" fill="#BFE8D5" fillOpacity=".75" />
            <path d="M76 34l10-5-2 11 2 11-10-5" fill="#3E260E" />
        </svg>
    );
}