import { cn } from "@/lib/utils";

export function Honeycomb({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 120 120"
            className={cn("absolute h-28 w-28", className)}
            fill="none"
            aria-hidden="true"
        >
            <g fill="#F8C63D" stroke="#E2A61A" strokeWidth="2">
                <polygon points="25,5 45,5 55,22 45,39 25,39 15,22" />
                <polygon points="55,5 75,5 85,22 75,39 55,39 45,22" />
                <polygon points="85,5 105,5 115,22 105,39 85,39 75,22" />

                <polygon points="40,31 60,31 70,48 60,65 40,65 30,48" />
                <polygon points="70,31 90,31 100,48 90,65 70,65 60,48" />

                <polygon points="25,57 45,57 55,74 45,91 25,91 15,74" />
                <polygon points="55,57 75,57 85,74 75,91 55,91 45,74" />
                <polygon points="85,57 105,57 115,74 105,91 85,91 75,74" />
            </g>
        </svg>
    );
}