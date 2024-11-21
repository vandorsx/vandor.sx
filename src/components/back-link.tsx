const mappings: {
   path: string;
   related: (string | RegExp)[];
}[] = [{ path: "/microblog", related: [/^\/microblog\?page=\d+$/] }];

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

type BackLinkProps = {
   href: string;
   text: string;
   bypass?: boolean;
};

export default function BackLink({ href, text, bypass }: BackLinkProps) {
   const handleClick = (e: Event) => {
      const backLinkPath = href;
      const previousPath = getPreviousPath();

      if (!previousPath) return;
      if (bypass) return;

      if (previousPath === backLinkPath) {
         e.preventDefault();
         history.back();
      } else {
         const mapping = mappings.find(
            (mapping) => mapping.path === backLinkPath,
         );

         if (
            mapping &&
            mapping.related.some((pattern) =>
               pattern instanceof RegExp ?
                  pattern.test(previousPath)
               :  pattern === previousPath,
            )
         ) {
            e.preventDefault();
            history.back();
         }
      }
   };

   return (
      <div id="back-link">
         <a
            href={href}
            class="font-serif text-xs italic text-black/[.34] hover:underline"
            onClick={handleClick}
         >
            &#8592;&nbsp;&nbsp;{text}
         </a>
      </div>
   );
}
