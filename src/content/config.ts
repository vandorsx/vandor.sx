import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
   loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
   schema: z.object({
      draft: z.boolean().default(false),
      datePublished: z.date(),
      dateModified: z.date().optional(),
      title: z.string(),
      description: z.string(),
      tags: z.string().array().optional(),
      image: z.string().optional(),
   }),
});

export const collections = {
   blog,
};
