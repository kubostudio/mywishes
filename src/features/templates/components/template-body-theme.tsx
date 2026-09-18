"use client";

import { useEffect } from "react";
import type { CustomThemeConfig } from "../types";

export function applyCustomThemeProperties(customTheme: CustomThemeConfig | null | undefined) {
    if (!customTheme) return;
    const props: Record<string, string> = {
        "--tmpl-page-bg": customTheme.background,
        "--tmpl-card-bg": customTheme.card,
        "--tmpl-card-subtle": customTheme.cardSubtle || customTheme.card,
        "--tmpl-card-border": customTheme.border,
        "--tmpl-border-subtle": customTheme.border,
        "--tmpl-text-title": customTheme.textTitle,
        "--tmpl-text-body": customTheme.textBody,
        "--tmpl-text-muted": customTheme.textBody,
        "--tmpl-accent": customTheme.accent,
        "--tmpl-accent-hover": customTheme.accent,
        "--tmpl-accent-shadow": customTheme.accent,
        "--tmpl-accent-text": customTheme.accentText || "#ffffff",
        "--tmpl-badge-bg": customTheme.accent + "26", // ~15% opacity tint
        "--tmpl-badge-text": customTheme.accent,
    };

    Object.entries(props).forEach(([key, value]) => {
        if (value) {
            document.documentElement.style.setProperty(key, value);
            document.body.style.setProperty(key, value);
            document.querySelectorAll<HTMLElement>("[data-template]").forEach((el) => {
                el.style.setProperty(key, value);
            });
        }
    });
}

export function clearCustomThemeProperties() {
    const keys = [
        "--tmpl-page-bg",
        "--tmpl-card-bg",
        "--tmpl-card-subtle",
        "--tmpl-card-border",
        "--tmpl-border-subtle",
        "--tmpl-text-title",
        "--tmpl-text-body",
        "--tmpl-text-muted",
        "--tmpl-accent",
        "--tmpl-accent-hover",
        "--tmpl-accent-shadow",
        "--tmpl-accent-text",
        "--tmpl-badge-bg",
        "--tmpl-badge-text",
    ];
    keys.forEach((key) => {
        document.documentElement.style.removeProperty(key);
        document.body.style.removeProperty(key);
        document.querySelectorAll<HTMLElement>("[data-template]").forEach((el) => {
            el.style.removeProperty(key);
        });
    });
}

export function TemplateBodyTheme({
    templateId,
    customTheme,
}: {
    templateId?: string;
    customTheme?: CustomThemeConfig | null;
}) {
    useEffect(() => {
        if (!templateId) return;

        // Establece el atributo data-template en el elemento raíz <body> y contenedores
        document.body.setAttribute("data-template", templateId);
        document.querySelectorAll("[data-template]").forEach((el) => {
            el.setAttribute("data-template", templateId);
        });

        if (templateId === "custom" && customTheme) {
            applyCustomThemeProperties(customTheme);
        } else {
            clearCustomThemeProperties();
        }

        return () => {
            document.body.removeAttribute("data-template");
            clearCustomThemeProperties();
        };
    }, [templateId, customTheme]);

    if (templateId === "custom" && customTheme) {
        return (
            <style
                id="custom-theme-ssr-styles"
                dangerouslySetInnerHTML={{
                    __html: `
                        :root, body[data-template="custom"], [data-template="custom"] {
                            --tmpl-page-bg: ${customTheme.background} !important;
                            --tmpl-card-bg: ${customTheme.card} !important;
                            --tmpl-card-subtle: ${customTheme.cardSubtle || customTheme.card} !important;
                            --tmpl-card-border: ${customTheme.border} !important;
                            --tmpl-border-subtle: ${customTheme.border} !important;
                            --tmpl-text-title: ${customTheme.textTitle} !important;
                            --tmpl-text-body: ${customTheme.textBody} !important;
                            --tmpl-text-muted: ${customTheme.textBody} !important;
                            --tmpl-accent: ${customTheme.accent} !important;
                            --tmpl-accent-hover: ${customTheme.accent} !important;
                            --tmpl-accent-shadow: ${customTheme.accent} !important;
                            --tmpl-accent-text: ${customTheme.accentText || "#ffffff"} !important;
                            --tmpl-badge-bg: ${customTheme.accent}26 !important;
                            --tmpl-badge-text: ${customTheme.accent} !important;
                        }
                    `,
                }}
            />
        );
    }

    return null;
}

