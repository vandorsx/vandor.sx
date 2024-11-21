type sitemap = {
   loc: string;
   lastmod?: string;
   changefreq?: string;
   priority?: string;
}[];

export const sitemap: sitemap = [
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
   {
      loc: "/library",
      changefreq: "weekly",
      priority: "0.8",
   },
];
