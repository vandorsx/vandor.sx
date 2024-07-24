import * as cheerio from "cheerio";

export const createLegacyRichLinks = (content_html: string): string => {
   const $ = cheerio.load(`<div class="content-wrapper">${content_html}</div>`);
   const richLinkContainers = $(".rl-container");

   richLinkContainers.each(function () {
      const richLink = $(this).find("blockquote");

      const url = richLink.attr("cite") || "";
      const title = richLink.find(".rl-title").text() || "";
      const snippet = richLink.find(".rl-snippet").text() || "";

      const niceUrl = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");

      let innerHTML = "";
      if (snippet.length > 0) {
         innerHTML += `
                <p class="rl-snippet">${snippet}</p>
            `;
      }
      innerHTML += `
                     <footer>
                        ${title ? `<span class="rl-title">${title}</span>` : ""}
                        <div class="rl-url-container">
                           <cite class="rl-url">${niceUrl}</cite>
                        </div>
                     </footer>
                  `;

      richLink.html(innerHTML);
      richLink.addClass("rich-link");
      richLink.unwrap();
   });

   return $(".content-wrapper").html() || content_html;
};
