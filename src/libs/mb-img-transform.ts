import * as cheerio from "cheerio";
import type { MicroblogPhoto } from "~libs/microblog";
import { MICROBLOG_BASE_URL } from "astro:env/client";

// for alt text
const htmlEntities: { [key: string]: string } = {
    "&10;": "\n", // newline
    "&13;": "\r", // carriage return
    "&32;": " ", // space
    "&quot;": '"', // straight quotation mark
    "&amp;": "&", // ampersand
    "&lt;": "<", // less than
    "&gt;": ">", // greater than
    "&nbsp;": " ", // non-breaking space
    "&ldquo;": '"', // left double smart quote
    "&rdquo;": '"', // right double smart quote
    "&lsquo;": "'", // left single smart quote
    "&rsquo;": "'", // right single smart quote
    "&mdash;": "—", // em dash
    "&ndash;": "–", // en dash
    "&hellip;": "…", // ellipsis
};

const MAX_WIDTH = 605;
const MAX_HEIGHT = 605;

const NON_CDN_EXTS = ["webp"];

const transformImage = (
    content_html: string,
    photos?: MicroblogPhoto[],
    lazy?: "lazy",
): string => {
    const $ = cheerio.load(`<div class="html-wrapper">${content_html}</div>`);
    const images = $("img");

    images.each(function () {
        const img = $(this);
        const src = img.attr("src") || "";

        const imgExt = src?.split(".").pop()?.toLowerCase();

        const imgAlt = img.attr("alt")?.trim() || "";
        const formattedImgAlt =
            imgAlt ?
                imgAlt.replace(
                    /&\w+;/g,
                    (entity) => htmlEntities[entity] || entity,
                )
            :   "";
        if (imgAlt) {
            img.attr("alt", formattedImgAlt);
        }

        // Check if image is hosted via Micro.blog
        const isMicroblogPhoto = src.startsWith(
            `${MICROBLOG_BASE_URL}/uploads`,
        );

        // Optimize image if hosted via Micro.blog and not already optimized (e.g., a pre-optimized webp)
        if (isMicroblogPhoto && !NON_CDN_EXTS.includes(imgExt ?? "")) {
            const optimizedSrc = `https://cdn.micro.blog/photos/768x/${encodeURIComponent(src)}`;
            img.attr("src", optimizedSrc);
        }

        // Apply width & height attributes
        const imgData = photos?.find((photo) => photo.url === src);
        if (
            (imgData && imgData.width > 0 && imgData.height > 0) ||
            (Number(img.attr("width")) > 0 && Number(img.attr("height")) > 0)
        ) {
            const aspectRatio =
                imgData ?
                    imgData.width / imgData.height
                :   Number(img.attr("width")) / Number(img.attr("height"));
            const isTallImg = aspectRatio < 1;
            const isWideImg = aspectRatio > 1;

            let width: number;
            let height: number;
            if (imgData) {
                width = imgData.width;
                height = imgData.height;
            } else {
                width = Number(img.attr("width"));
                height = Number(img.attr("height"));
            }

            if (isTallImg && height > MAX_HEIGHT) {
                height = MAX_HEIGHT;
                width = Math.round(height * aspectRatio);
            } else if (isWideImg && width > MAX_WIDTH) {
                width = MAX_WIDTH;
                height = Math.round(width / aspectRatio);
            } else if (height > MAX_HEIGHT && width > MAX_WIDTH) {
                height = MAX_HEIGHT;
                width = MAX_WIDTH;
            }

            img.attr("width", width.toString());
            img.attr("height", height.toString());

            if (lazy) {
                img.attr("loading", "lazy");
            }
        }

        // Remove parent <p> tag if it exists
        const parentP = img.parent("p");
        if (parentP.length) {
            img.unwrap();
            parentP.remove();
        }

        // Create elements
        const mbImage = $("<div>").attr("class", "mb-image");

        // Build structure
        img.wrap(mbImage);
    });

    return $(".html-wrapper").html() || "";
};

export default transformImage;
