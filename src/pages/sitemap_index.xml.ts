export const prerender = false;
import type { APIRoute } from "astro";
import { GET as BlogGET } from "./blog/lastmod.json.ts";

const SITE = "https://vandor.sx";

type lastmod = {
   lastmod: string;
};

export const GET: APIRoute = async (context) => {
   let microblog_lastmod: lastmod = { lastmod: "" };
   try {
      const res = await fetch(
         `https://${import.meta.env.MICROBLOG_BASE_URL}/api/lastmod.json`,
      );

      if (!res.ok) {
         throw new Error(`Failed to fetch microblog lastmod: ${res.status}`);
      } else {
         const json = await res.json();
         microblog_lastmod = { lastmod: json.lastmod };
      }
   } catch (e) {
      console.error(e);
   }

   let blog_lastmod: lastmod = { lastmod: "" };
   try {
      const res = await BlogGET(context);

      if (!res.ok) {
         throw new Error(`Failed to fetch blog lastmod: ${res.status}`);
      } else {
         const json = await res.json();
         blog_lastmod = { lastmod: json.lastmod };
      }
   } catch (e) {
      console.error(e);
   }

   const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>https://microblog.vandor.sx/sitemap.xml</loc>
        ${microblog_lastmod.lastmod ? `<lastmod>${microblog_lastmod.lastmod}</lastmod>` : ""}
      </sitemap>
      <sitemap>
         <loc>${SITE}/blog/sitemap.xml</loc>
         ${blog_lastmod.lastmod ? `<lastmod>${blog_lastmod.lastmod}</lastmod>` : ""}
      </sitemap>
    </sitemapindex>`;

   return new Response(sitemapIndex, {
      status: 200,
      headers: {
         "Content-Type": "application/xml",
         "Cache-Control": "public, max-age=300",
      },
   });
};
