type CountdownLabelProps = {
    date: string;
};

export function CountdownLabel({ date }: CountdownLabelProps) {

    const today = new Date();

    // Supabase: "2026-08-09 00:00:00"
    const dateOnly = date.split(" ")[0]; // "2026-08-09"
    const [year, month, day] = dateOnly.split("-").map(Number);

    // Crear la fecha explícitamente en hora local
    const eventDate = new Date(year, month - 1, day);

    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    const diffMs = eventDate.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
        return <span>Faltan {diffDays} días</span>;
    }

    if (diffDays === 1) {
        return <span>Falta 1 día</span>;
    }

    if (diffDays === 0) {
        return <span>Es hoy</span>;
    }

    return <span>Evento finalizado</span>;
}