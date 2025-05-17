import type { APIRoute } from "astro";

const SITE = "https://vandor.sx";

const slist: {
    loc: string;
    lastmod?: string;
    changefreq?: string;
    priority?: string;
}[] = [
    {
        loc: "/microblog",
        changefreq: "hourly",
        priority: "1.0",
    },
    {
        loc: "/blog",
        changefreq: "weekly",
        priority: "1.0",
    },
    {
        loc: "/web-presence",
        changefreq: "monthly",
        priority: "0.9",
    },
];

export const GET: APIRoute = async () => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
       <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
           ${slist
               .map(
                   (page) => `
            <url>
                <loc>${SITE}${page.loc}</loc>
                ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ""}
                ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ""}
                ${page.priority ? `<priority>${page.priority}</priority>` : ""}
            </url>`,
               )
               .join("")}
       </urlset>`;

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=86400",
        },
    });
};
