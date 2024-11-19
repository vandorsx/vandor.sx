import * as cheerio from "cheerio";
import type { MicroblogPhoto } from "~libs/microblog";

const MAX_WIDTH = 605;
const MAX_HEIGHT = 605;

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
      const initialSrc = src.toString();

      // Check if image is hosted via Micro.blog
      const isMicroblogPhoto = src.startsWith(
         `https://${import.meta.env.MICROBLOG_BASE_URL}/uploads`,
      );

      // Optimize image if hosted via Micro.blog
      if (isMicroblogPhoto) {
         const optimizedSrc = `https://micro.blog/photos/768x/${encodeURIComponent(src)}`;
         img.attr("src", optimizedSrc);
      }

      // Apply width & height attributes
      let imgData;
      if (photos) {
         imgData = photos.find((photo) => photo.url === src);
      }
      if (
         (imgData && imgData.width > 0 && imgData.height > 0) ||
         (Number(img.attr("width")) > 0 && Number(img.attr("height")) > 0)
      ) {
         let aspectRatio;
         if (imgData) {
            aspectRatio = imgData.width / imgData.height;
         } else {
            aspectRatio = Number(img.attr("width")) / Number(img.attr("height"));
         }
         const isTallImg = aspectRatio < 1;
         const isWideImg = aspectRatio > 1;

         let width, height;
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
      const imgDiv = $("<div>");
      const viewImg = $("<span>")
         .text("view ")
         .append(
            $("<a>")
               .attr("href", initialSrc)
               .attr("target", "_blank")
               .attr("rel", "noopener noreferrer")
               .text("full image"),
         );
      const mbImage = $("<div>").attr("class", "mb-image");
      const innerDiv = $("<div>");

      // Build structure
      img.wrap(imgDiv);
      imgDiv.wrap(innerDiv);
      imgDiv.after(viewImg);
      innerDiv.wrap(mbImage);
   });

   return $(".html-wrapper").html() || "";
};

export default transformImage;
