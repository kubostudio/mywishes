import { Suspense } from "react";

import { LoginForm } from "@/features/auth/components/login-form";
import { ForestDecor } from "@/components/storybook/story-decor";

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_20%_10%,#FFD9E2_0,transparent_24rem),radial-gradient(circle_at_80%_20%,#BDEBFF_0,transparent_24rem),linear-gradient(180deg,#FFF8E8,#FFEFC4)] px-4 py-10">
            <ForestDecor />
            <Suspense fallback={null}>
                <LoginForm />
            </Suspense>
        </main>
    );
}