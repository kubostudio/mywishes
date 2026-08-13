"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Gift, Mail, LockKeyhole, Sparkles, User } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerAction } from "@/features/auth/actions/register-action";
import {
    registerSchema,
    type RegisterInput,
} from "@/features/auth/schemas/register-schema";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

export function RegisterForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            acceptTerms: false,
        },
    });

    function onSubmit(values: RegisterInput) {
        startTransition(async () => {
            const result = await registerAction(values);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            router.push("/login");
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
                    Empieza tu lista
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-[#3E260E]">
                    Crear cuenta
                </h1>

                <p className="mt-3 text-base font-semibold leading-7 text-[#7A4E28]">
                    Crea una cuenta para preparar tu lista de regalos.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold text-[#5A371C]">
                                    Nombre
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#B97A22]" />
                                        <input
                                            placeholder="Tu nombre"
                                            type="text"
                                            autoComplete="name"
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
                                            placeholder="Mínimo 8 caracteres"
                                            type="password"
                                            autoComplete="new-password"
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
                        name="acceptTerms"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-start gap-3 rounded-[1.5rem] bg-[#FFF8E7] p-4">
                                    <FormControl>
                                        <input
                                            type="checkbox"
                                            id="acceptTerms"
                                            checked={field.value}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                            className="mt-1 size-4 shrink-0 cursor-pointer accent-[#B97A22]"
                                        />
                                    </FormControl>

                                    <div className="min-w-0 flex-1">
                                        <label
                                            htmlFor="acceptTerms"
                                            className="block cursor-pointer text-sm font-semibold leading-6 text-[#7A4E28]"
                                        >
                                            Acepto los{" "}
                                            <Link
                                                href="/terminos"
                                                target="_blank"
                                                onClick={(e) => e.stopPropagation()}
                                                className="font-black text-[#B97A22] underline underline-offset-2"
                                            >
                                                Términos y Condiciones
                                            </Link>{" "}
                                            y reconozco la{" "}
                                            <Link
                                                href="/privacidad"
                                                target="_blank"
                                                onClick={(e) => e.stopPropagation()}
                                                className="font-black text-[#B97A22] underline underline-offset-2"
                                            >
                                                Política de Privacidad
                                            </Link>
                                            .
                                        </label>

                                        <FormMessage className="mt-1" />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    <button
                        type="submit"
                        disabled={isPending}
                        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#F8C63D] px-6 text-sm font-black text-[#3E260E] shadow-[0_5px_0_#B97A22] transition-all hover:-translate-y-0.5 hover:bg-[#FFD85F] disabled:opacity-60"
                    >
                        {isPending ? "Creando cuenta..." : "Crear cuenta"}
                    </button>
                </form>
            </Form>

            <p className="mt-6 text-center text-sm font-semibold text-[#7A4E28]">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="font-black text-[#B97A22] underline">
                    Inicia sesión
                </Link>
            </p>
        </div>
    );
}