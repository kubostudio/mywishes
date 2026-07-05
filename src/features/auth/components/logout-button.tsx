"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
    return (
        <button
            type="button"
            onClick={() =>
                signOut({
                    callbackUrl: "/login",
                })
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-[#E7C37B] bg-white px-4 text-sm font-extrabold text-[#5A371C] transition hover:bg-[#FFF1C9]"
        >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Salir</span>
        </button>
    );
}