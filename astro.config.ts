import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";
import solidJs from "@astrojs/solid-js";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
   integrations: [tailwind(), solidJs(), mdx()],
   output: "hybrid",
   adapter: cloudflare(),
   build: {
      format: "file",
   },
   experimental: {
      serverIslands: true,
   },
   prefetch: {
      prefetchAll: true,
      defaultStrategy: "hover",
   },
   site: "https://inthetrees.me",
   markdown: {
      shikiConfig: {
         theme: "slack-ochin",
      },
   },
});
