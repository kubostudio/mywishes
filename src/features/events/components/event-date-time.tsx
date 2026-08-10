"use client";

type EventDateTimeProps = {
    startsAt: string;
    endsAt?: string;
    eventTimezone?: string;
    showLocalEquivalence?: boolean;
};

function formatDate(date: Date, timeZone: string) {
    return new Intl.DateTimeFormat("es-PE", {
        timeZone,
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

function formatShortDate(date: Date, timeZone: string) {
    return new Intl.DateTimeFormat("es-PE", {
        timeZone,
        weekday: "short",
        day: "numeric",
        month: "short",
    }).format(date);
}

function formatTime(date: Date, timeZone: string) {
    return new Intl.DateTimeFormat("es-PE", {
        timeZone,
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

function getDateKey(date: Date, timeZone: string) {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date);
}

function getTimezoneCity(timeZone: string) {
    return timeZone.split("/").pop()?.replaceAll("_", " ") ?? timeZone;
}

function TimeRange({
    start,
    end,
    timeZone,
}: {
    start: Date;
    end: Date | null;
    timeZone: string;
}) {
    if (!end) {
        return (
            <span>
                {formatTime(start, timeZone)}
            </span>
        );
    }

    const sameDay =
        getDateKey(start, timeZone) ===
        getDateKey(end, timeZone);

    if (sameDay) {
        return (
            <span>
                {formatTime(start, timeZone)}
                {" – "}
                {formatTime(end, timeZone)}
            </span>
        );
    }

    return (
        <span>
            {formatTime(start, timeZone)}
            {" → "}
            {formatShortDate(end, timeZone)},{" "}
            {formatTime(end, timeZone)}
        </span>
    );
}

export function EventDateTime({
    startsAt,
    endsAt,
    eventTimezone,
    showLocalEquivalence = true,
}: EventDateTimeProps) {
    const start = new Date(startsAt);
    const end = endsAt ? new Date(endsAt) : null;

    const viewerTimezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone;

    const originalTimezone =
        eventTimezone || viewerTimezone;

    const viewerIsDifferent =
        viewerTimezone !== originalTimezone;

    return (
        <div className="space-y-2">
            <p className="text-lg font-black capitalize leading-snug text-[#3B2412]">
                {formatDate(start, originalTimezone)}
            </p>

            <p className="text-base font-bold text-[#7A5631]">
                <TimeRange
                    start={start}
                    end={end}
                    timeZone={originalTimezone}
                />
            </p>

            {viewerIsDifferent ? (
                <p className="text-xs font-bold text-[#A47A42]">
                    Hora del evento · {getTimezoneCity(originalTimezone)}
                </p>
            ) : null}

            {showLocalEquivalence && viewerIsDifferent ? (
                <div className="mt-3 inline-flex flex-col rounded-2xl bg-[#FFF4D8] px-4 py-3">
                    <p className="text-xs font-black uppercase tracking-wide text-[#A47A42]">
                        Tu hora local
                    </p>

                    <p className="mt-1 text-sm font-black text-[#3B2412]">
                        <TimeRange
                            start={start}
                            end={end}
                            timeZone={viewerTimezone}
                        />
                    </p>

                    <p className="mt-0.5 text-xs font-semibold text-[#8A6332]">
                        {getTimezoneCity(viewerTimezone)}
                    </p>
                </div>
            ) : null}
        </div>
    );
}