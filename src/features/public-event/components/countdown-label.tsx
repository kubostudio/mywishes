type CountdownLabelProps = {
    date: Date;
};

export function CountdownLabel({ date }: CountdownLabelProps) {
    const now = new Date();

    const todayPeru = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Lima",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(now);

    const [todayYear, todayMonth, todayDay] = todayPeru.split("-").map(Number);

    const eventYear = date.getUTCFullYear();
    const eventMonth = date.getUTCMonth();
    const eventDay = date.getUTCDate();

    const todayUtc = Date.UTC(
        todayYear,
        todayMonth - 1,
        todayDay
    );

    const eventUtc = Date.UTC(
        eventYear,
        eventMonth,
        eventDay
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