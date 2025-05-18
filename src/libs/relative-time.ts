const rel_format: Intl.RelativeTimeFormat = new Intl.RelativeTimeFormat("en", {
    numeric: "always",
});
const rel_units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: "year", seconds: 31540000 },
    { unit: "month", seconds: 2628000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
];

export const formatTimeRelatively = (input: Date | string): string => {
    const now = new Date();

    const date = typeof input === "string" ? new Date(input) : input;

    const diffSeconds = (date.getTime() - now.getTime()) / 1000;
    if (Math.abs(diffSeconds) < 60) {
        return "less than a minute ago";
    }

    for (const { unit, seconds } of rel_units) {
        if (Math.abs(diffSeconds) >= seconds) {
            return rel_format.format(Math.round(diffSeconds / seconds), unit);
        }
    }

    return "date error";
};
