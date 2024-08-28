const mappings: {
   path: string;
   related: string[];
}[] = [{ path: "/microblog", related: ["/microblog/archive"] }];

function getPreviousPath(): string | null {
   try {
      const pathStack: string[] = JSON.parse(
         sessionStorage.getItem("path-stack") || "[]",
      );
      return pathStack.length > 1 ? pathStack[pathStack.length - 2] : null;
   } catch (e: unknown) {
      console.error("Error getting previous path:", e);
      return null;
   }
}

export default function BackLink({
   href,
   text,
}: {
   href: string;
   text: string;
}) {
   const handleClick = (e: Event) => {
      const backLinkPath = href;
      const previousPath = getPreviousPath();

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
      <div id="back-link">
         <a
            href={href}
            class="text-charcoal-250 font-serif text-xs italic hover:underline"
            onClick={handleClick}
         >
            &#8592;&nbsp;&nbsp;{text}
         </a>
      </div>
   );
}
