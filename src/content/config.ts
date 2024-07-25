import { z, defineCollection } from "astro:content";

const blog = defineCollection({
   type: "content",
   schema: z.object({
      draft: z.boolean().default(false),
      datePublished: z.date(),
      dateModified: z.date().optional(),
      description: z.string(),
      tags: z.string().array(),
      image: z
         .object({
            src: z.string(),
            alt: z.string(),
         })
         .optional(),
   }),
});

export const collections = {
   blog,
};
