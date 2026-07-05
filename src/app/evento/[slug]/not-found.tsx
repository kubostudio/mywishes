import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function PublicEventNotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <div className="max-w-md text-center">
                <h1 className="text-2xl font-semibold">Evento no encontrado</h1>

                <p className="mt-3 text-muted-foreground">
                    La lista que intentas abrir no existe o ya no está disponible.
                </p>

                <Button asChild className="mt-6">
                    <Link href="/register">Crear mi propia lista</Link>
                </Button>
            </div>
        </main>
    );
}