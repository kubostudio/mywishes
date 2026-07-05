import { RegisterForm } from "@/features/auth/components/register-form";
import { ForestDecor } from "@/components/storybook/story-decor";

export default function RegisterPage() {
    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <ForestDecor />
            <RegisterForm />
        </main>
    );
}