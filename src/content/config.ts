import { z, defineCollection } from "astro:content";

const blog = defineCollection({
   type: "content",
   schema: z.object({
      datePublished: z.date(),
      dateModified: z.date().optional(),
      description: z.string(),
      tags: z.string().array(),
      image: z.string().optional(),
   }),
});

export const collections = {
   blog,
};
