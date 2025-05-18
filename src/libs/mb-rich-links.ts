import * as cheerio from "cheerio";

export const createRichLinks = (content_html: string): string => {
    const $ = cheerio.load(
        `<div class="content-wrapper">${content_html}</div>`,
    );
    const richLinks = $(".mb-rlink");

    richLinks.each(function () {
        const richLink = $(this);
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
        linkElement.attr("rel", "noopener noreferrer");
    });

    return $(".content-wrapper").html() || content_html;
};
