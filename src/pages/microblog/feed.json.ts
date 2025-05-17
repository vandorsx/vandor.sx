import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
    const feed = await fetch("https://microblog.vandor.sx/feed.json");

    return new Response(feed.body, {
        headers: {
            "Content-Type": "application/feed+json",
        },
    });
};
