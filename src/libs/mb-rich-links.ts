import * as cheerio from "cheerio";

export const createRichLinks = (content_html: string): string => {
    const $ = cheerio.load(
        `<div class="content-wrapper">${content_html}</div>`,
    );
    const richLinks = $(".rich-link"); // TO DO: change to mb-rlink

    richLinks.each(function () {
        const richLink = $(this);
        richLink.removeClass("rich-link");
        richLink.addClass("mb-rlink");

        richLink.find("footer > p > b").contents().unwrap();

        const linkElement = richLink.find("cite a");
        const url =
            $(this).attr("cite") ||
            linkElement.attr("href") ||
            linkElement.text();

        const niceUrl = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");
        linkElement.text(niceUrl);
        linkElement.attr("target", "_blank");
    });

    return $(".content-wrapper").html() || content_html;
};

export const createLegacyRichLinks = (content_html: string): string => {
    const $ = cheerio.load(
        `<div class="content-wrapper">${content_html}</div>`,
    );
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
                <p>${snippet}</p>
            `;
        }
        innerHTML += `
                     <footer>
                        ${title ? `<span>${title}</span>` : ""}
                        <div>
                           <cite><a href="${url}" target="_blank">${niceUrl}</a></cite>
                        </div>
                     </footer>
                  `;

        richLink.html(innerHTML);
        richLink.addClass("mb-rlink");
        richLink.unwrap();
    });

    return $(".content-wrapper").html() || content_html;
};
