import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
    const blog = await getCollection("blog", ({ data }) =>
        import.meta.env.PROD ? data.draft !== true : true,
    ).then(
        (
            posts, // sort by most recent date (dateModified or datePublished)
        ) =>
            posts.sort(
                (a, b) =>
                    new Date(
                        b.data.dateModified || b.data.datePublished,
                    ).getTime() -
                    new Date(
                        a.data.dateModified || a.data.datePublished,
                    ).getTime(),
            ),
    );

    const json = {
        lastmod:
            blog[0]?.data.dateModified || blog[0]?.data.datePublished || null,
    };

    return new Response(JSON.stringify(json), {
        headers: {
            "Content-Type": "application/json",
        },
    });
};
