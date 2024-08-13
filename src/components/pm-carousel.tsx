import { onMount, createSignal } from "solid-js";
import { type EmblaCarouselType, type EmblaOptionsType } from "embla-carousel";
import createEmblaCarousel from "embla-carousel-solid";

interface Props {
   photos: {
      fallback: string;
      extensions: string[];
      alt: string;
      title?: string;
   }[];
}

export default function PMCarousel({ photos }: Props) {
   const [options, _] = createSignal<EmblaOptionsType>({
      container: ".embla__container",
      slides: ".embla__slide",
   });
   const [emblaRef, emblaApi] = createEmblaCarousel(() => options());
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
         <div>
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
                        />
                     </picture>
                  </div>
               ))}
            </div>
         </div>
         <div class="embla__meta">
            <div class="embla__buttons">
               <button
                  class="embla__prev"
                  onClick={scrollPrev}
                  disabled={!canScrollPrev()}
                  aria-label="Slide to previous image"
               >
                  &larr;
               </button>
               <button
                  class="embla__next"
                  onClick={scrollNext}
                  disabled={!canScrollNext()}
                  aria-label="Slide to next image"
               >
                  &rarr;
               </button>
            </div>
         </div>
      </div>
   );
}
