import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";

import solidJs from "@astrojs/solid-js";

import mdx from "@astrojs/mdx";

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
    integrations: [solidJs(), mdx()],

    env: {
        schema: {
            MICROBLOG_BASE_URL: envField.string({
                context: "server",
                access: "public",
            }),
            MICROBLOG_API_TOKEN: envField.string({
                context: "server",
                access: "secret",
            }),
        },
    },
});
