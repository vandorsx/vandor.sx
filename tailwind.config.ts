import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
   content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
   theme: {
      extend: {
         fontFamily: {
            sans: ["seven sans", ...defaultTheme.fontFamily.sans],
            serif: ["seven serif", ...defaultTheme.fontFamily.serif],
         },
         colors: {
            matcha: "#7f9862",
            charcoal: {
               100: "#f5f2ef",
               250: "#b5b3ae",
               500: "#8c8c8c",
               750: "#232323",
               900: "#070707",
            },
         },
         fontSize: {
            "slightly-smaller": "calc(1em - 1px)",
         },
         fontWeight: {
            bolder: "bolder",
         },
      },
   },
   plugins: [require("@tailwindcss/typography")],
} satisfies Config;
