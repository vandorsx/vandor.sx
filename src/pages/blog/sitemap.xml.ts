import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const SITE = "https://vandor.sx";

export const GET: APIRoute = async () => {
   const blog = await getCollection("blog", ({ data }) =>
      import.meta.env.PROD ? data.draft !== true : true,
   ).then(
      (
         posts, // sort by datePublished
      ) =>
         posts.sort(
            (a, b) =>
               new Date(b.data.datePublished).getTime() -
               new Date(a.data.datePublished).getTime(),
         ),
   );

   const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
       <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
         ${blog
            .map(
               (entry) =>
                  `<url>
               <loc>${SITE}/blog/${entry.id}</loc>
               <lastmod>${new Date(entry.data.datePublished).toISOString()}</lastmod>
               <priority>0.7</priority>
            </url>`,
            )
            .join("")}
       </urlset>`;

   return new Response(sitemap, {
      status: 200,
      headers: {
         "Content-Type": "application/xml",
         "Cache-Control": "public, max-age=86400",
      },
   });
};
