import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
    const feed = await fetch("https://microblog.vandor.sx/sitemap.xml");

    return new Response(feed.body, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
};
