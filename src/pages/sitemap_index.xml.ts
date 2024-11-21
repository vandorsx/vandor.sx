import type { APIRoute } from "astro";

type lastmod = {
   lastmod: string;
};

export const GET: APIRoute = async ({ request }) => {
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

   const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>https://microblog.vandor.sx/sitemap.xml</loc>
        ${microblog_lastmod.lastmod ? `<lastmod>${microblog_lastmod.lastmod}</lastmod>` : ""}
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
