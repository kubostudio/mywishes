"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Gift, Mail, LockKeyhole, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    loginSchema,
    type LoginInput,
} from "@/features/auth/schemas/login-schema";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(values: LoginInput) {
        startTransition(async () => {
            const result = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
                callbackUrl,
            });

            if (result?.error) {
                toast.error("Email o contraseña incorrectos.");
                return;
            }

            toast.success("Sesión iniciada correctamente.");
            router.push(callbackUrl);
            router.refresh();
        });
    }

    async function handleGoogleLogin() {
        await signIn("google", {
            callbackUrl,
        });
    }

    return (
        <div className="w-full max-w-md rounded-[2.5rem] border-2 border-[#E8C78A] bg-[#FFFDF7] p-8 shadow-[0_24px_70px_rgba(101,67,33,0.18)]">
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-[1.75rem] bg-[#F8C63D] text-[#3E260E] shadow-[0_5px_0_#B97A22]">
                    <Gift className="size-8" />
                </div>

                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#FFF1B8] px-4 py-1.5 text-xs font-black text-[#5A371C]">
                    <Sparkles className="size-3.5" />
                    Bienvenido de vuelta
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-[#3E260E]">
                    Iniciar sesión
                </h1>

                <p className="mt-3 text-base font-semibold leading-7 text-[#7A4E28]">
                    Accede para preparar y compartir tu lista de regalos.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold text-[#5A371C]">
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#B97A22]" />
                                        <input
                                            placeholder="tu@email.com"
                                            type="email"
                                            autoComplete="email"
                                            className="h-12 w-full rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] pl-12 pr-5 text-sm font-bold text-[#4A2D16] outline-none focus:border-[#F8C63D] focus:ring-4 focus:ring-[#F8D56B]/35"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold text-[#5A371C]">
                                    Contraseña
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <LockKeyhole className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#B97A22]" />
                                        <input
                                            placeholder="Tu contraseña"
                                            type="password"
                                            autoComplete="current-password"
                                            className="h-12 w-full rounded-full border-2 border-[#E8C78A] bg-[#FFF8E7] pl-12 pr-5 text-sm font-bold text-[#4A2D16] outline-none focus:border-[#F8C63D] focus:ring-4 focus:ring-[#F8D56B]/35"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <button
                        type="submit"
                        disabled={isPending}
                        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#F8C63D] px-6 text-sm font-black text-[#3E260E] shadow-[0_5px_0_#B97A22] transition-all hover:-translate-y-0.5 hover:bg-[#FFD85F] disabled:opacity-60"
                    >
                        {isPending ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>
            </Form>

            <div className="my-6 flex items-center gap-4">
                <div className="h-0.5 flex-1 bg-[#F1D7A5]" />
                <span className="text-xs font-black text-[#A47A42]">o</span>
                <div className="h-0.5 flex-1 bg-[#F1D7A5]" />
            </div>

            <button
                type="button"
                onClick={handleGoogleLogin}
                className="inline-flex h-12 w-full items-center justify-center rounded-full border-2 border-[#E8C78A] bg-white px-6 text-sm font-black text-[#5A371C] transition hover:bg-[#FFF1C9]"
            >
                Continuar con Google
            </button>

            <p className="mt-6 text-center text-sm font-semibold text-[#7A4E28]">
                ¿No tienes cuenta?{" "}
                <Link href="/register" className="font-black text-[#B97A22] underline">
                    Crear cuenta
                </Link>
            </p>
        </div>
    );
}