"use client";

import {
    type ReactNode,
    useEffect,
    useRef,
    useState,
} from "react";

type RevealProps = {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "left" | "right";
};

export function Reveal({
    children,
    className = "",
    delay = 0,
    direction = "up",
}: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;

        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.15,
                rootMargin: "0px 0px -40px 0px",
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    const hiddenTransform = {
        up: "translate-y-8",
        left: "-translate-x-10",
        right: "translate-x-10",
    }[direction];

    return (
        <div
            ref={ref}
            style={{
                transitionDelay: `${delay}ms`,
            }}
            className={[
                "transition-all duration-700 ease-out",
                visible
                    ? "translate-x-0 translate-y-0 opacity-100"
                    : `${hiddenTransform} opacity-0`,
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}