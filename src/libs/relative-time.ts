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

export const formatTimeRelatively = (date: Date | string): string => {
   const now: Date = new Date();

   if (typeof date === "string") {
      date = new Date(date);
   }

   const diff = (date.getTime() - now.getTime()) / 1000;

   for (const { unit, seconds } of rel_units) {
      if (Math.abs(diff) === 60) {
         return "1 minute ago";
      }
      if (Math.abs(diff) >= seconds) {
         return rel_format.format(Math.round(diff / seconds), unit);
      } else if (Math.abs(diff) < 1) {
         return "<1 second ago";
      }
   }

   return "date error";
};
