const mappings: {
   path: string;
   related: string[];
}[] = [{ path: "/microblog", related: ["/microblog/archive"] }];

export default function BackLink({
   href,
   text,
}: {
   href: string;
   text: string;
}) {
   const handleClick = (e: Event) => {
      const backLinkPath = href;
      const previousPath = sessionStorage.getItem("previous-path");

      if (!previousPath) return;

      if (previousPath === backLinkPath) {
         e.preventDefault();
         history.back();
      } else {
         const mapping = mappings.find(
            (mapping) => mapping.path === backLinkPath,
         );

         if (mapping && mapping.related.includes(previousPath)) {
            e.preventDefault();
            history.back();
         }
      }
   };

   return (
      <a
         href={href}
         class="inline-block font-serif text-xs italic text-black/[.27] no-underline hover:underline"
         onClick={handleClick}
      >
         &#8592;&nbsp;&nbsp;{text}
      </a>
   );
}
