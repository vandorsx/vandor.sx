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
            raspberry: "#fdcbe2",
         },
         fontSize: {
            "slightly-smaller": "calc(1em - 1px)",
         },
      },
   },
   plugins: [require("@tailwindcss/typography")],
} satisfies Config;
