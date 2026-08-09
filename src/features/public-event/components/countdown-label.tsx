type CountdownLabelProps = {
    date: Date;
};

export function CountdownLabel({ date }: CountdownLabelProps) {
    const today = new Date();

    const eventDate = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate()
    );

    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    const diffMs = eventDate.getTime() - today.getTime();
    const diffDays = Math.round(
        diffMs / (1000 * 60 * 60 * 24)
    );

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