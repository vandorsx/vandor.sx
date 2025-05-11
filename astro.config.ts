import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  vite: {
      plugins: [tailwindcss()],
  },

  output: "static",

  build: {
      format: "file",
  },

  prefetch: {
      prefetchAll: true,
      defaultStrategy: "hover",
  },

  site: "https://vandor.sx",
  adapter: cloudflare(),
  integrations: [solidJs()],
});