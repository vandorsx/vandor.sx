const non_rel_format: Intl.DateTimeFormatOptions = {
   month: "short",
   day: "2-digit",
   hour: "2-digit",
   minute: "2-digit",
   hour12: false,
};
const rel_format: Intl.RelativeTimeFormat = new Intl.RelativeTimeFormat("en", {
   numeric: "always",
});
const rel_units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
   { unit: "week", seconds: 604800 },
   { unit: "day", seconds: 86400 },
   { unit: "hour", seconds: 3600 },
   { unit: "minute", seconds: 60 },
   { unit: "second", seconds: 1 },
];

export const formatTimeRelatively = (
   date: Date | string,
   dynamic?: boolean,
): string => {
   const now: Date = new Date();

   if (typeof date === "string") {
      date = new Date(date);
   }

   const diff = (date.getTime() - now.getTime()) / 1000;

   if (!dynamic || Math.abs(diff) > rel_units[0].seconds) {
      return date.toLocaleString("en-US", non_rel_format).replace(" at ", ", ");
   }

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
