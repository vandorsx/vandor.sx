import type { APIRoute } from "astro";
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

const SITE = "jade.van-dorsten.net";
const AUTHOR = "jade@van-dorsten.net";

export const GET: APIRoute = async () => {
   const blog = await getCollection("blog");
   return rss({
      title: "inthetrees blog",
      description:
         "Where I publish longer-form writing and content that I consider to be more evergreen in nature.",
      site: `https://${SITE}/blog`,
      items: (
         await Promise.all(
            blog.map(async (entry) => {
               return {
                  title: entry.data.title,
                  description: entry.data.description,
                  link: `https://${SITE}/blog/${entry.slug}`,
                  author: AUTHOR,
                  pubDate: entry.data.datePublished,
               };
            }),
         )
      ).sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime()),
      trailingSlash: false,
      customData: `<language>en-us</language>`,
   });
};
