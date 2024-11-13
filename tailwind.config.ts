import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
   content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
   theme: {
      extend: {
         fontFamily: {
            sans: ["seven sans", ...defaultTheme.fontFamily.sans],
            serif: ["seven serif", ...defaultTheme.fontFamily.serif],
            mono: ["seven mono", ...defaultTheme.fontFamily.mono],
         },
         colors: {
            accent: "#8abad3", // https://icolorpalette.com/color/pantone-14-4318-tcx
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
