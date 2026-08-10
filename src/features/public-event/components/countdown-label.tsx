type CountdownLabelProps = {
    date: Date;
    timezone?: string | null;
};

function getDateParts(date: Date, timeZone: string) {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(date);

    const year = Number(
        parts.find((part) => part.type === "year")?.value
    );

    const month = Number(
        parts.find((part) => part.type === "month")?.value
    );

    const day = Number(
        parts.find((part) => part.type === "day")?.value
    );

    return { year, month, day };
}

export function CountdownLabel({
    date,
    timezone,
}: CountdownLabelProps) {
    const timeZone = timezone ?? "America/Lima";
    const now = new Date();

    const today = getDateParts(now, timeZone);
    const eventDay = getDateParts(date, timeZone);

    const todayUtc = Date.UTC(
        today.year,
        today.month - 1,
        today.day
    );

    const eventUtc = Date.UTC(
        eventDay.year,
        eventDay.month - 1,
        eventDay.day
    );

    const diffDays = Math.round(
        (eventUtc - todayUtc) / 86_400_000
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