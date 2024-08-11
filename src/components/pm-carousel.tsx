import { onMount, createSignal } from "solid-js";
import type { EmblaCarouselType } from "embla-carousel";
import createEmblaCarousel from "embla-carousel-solid";

interface Props {
   photos: {
      fallback: string;
      extensions: string[];
      dimensions: {
         width: number;
         height: number;
      };
      title: string;
      alt: string;
   }[];
}

export default function PMCarousel({ photos }: Props) {
   const [emblaRef, emblaApi] = createEmblaCarousel();
   let api: EmblaCarouselType | undefined;

   const [canScrollNext, setCanScrollNext] = createSignal(false);
   const [canScrollPrev, setCanScrollPrev] = createSignal(false);

   const updateCanScroll = () => {
      if (api) setCanScrollNext(api.canScrollNext());
      if (api) setCanScrollPrev(api.canScrollPrev());
   };

   onMount(() => {
      api = emblaApi();

      if (api) api.on("init", updateCanScroll);
      if (api) api.on("reInit", updateCanScroll);
      if (api) api.on("select", updateCanScroll);
   });

   const scrollPrev = () => {
      if (api) api.scrollPrev();
   };

   const scrollNext = () => {
      if (api) api.scrollNext();
   };

   return (
      <div class="embla" ref={emblaRef}>
         <div class="embla__container">
            {photos.map((photo) => (
               <div class="embla__slide">
                  <picture>
                     {photo.extensions.map((extension) => (
                        <source
                           srcset={`https://picture-me.inthetrees.me/${photo.fallback.split(".")[0]}.${extension}`}
                           type={`image/${extension}`}
                        />
                     ))}
                     <img
                        src={`https://picture-me.inthetrees.me/${photo.fallback}`}
                        alt={photo.alt}
                        width={photo.dimensions.width}
                        height={photo.dimensions.height}
                     />
                  </picture>
               </div>
            ))}
         </div>
         <div class="embla__buttons">
            <button
               class="embla__prev"
               onClick={scrollPrev}
               disabled={!canScrollPrev()}
            >
               &larr;
            </button>
            <button
               class="embla__next"
               onClick={scrollNext}
               disabled={!canScrollNext()}
            >
               &rarr;
            </button>
         </div>
      </div>
   );
}
