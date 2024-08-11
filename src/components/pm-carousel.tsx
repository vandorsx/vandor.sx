import { onMount, createSignal } from "solid-js";
import type { EmblaCarouselType } from "embla-carousel";
import createEmblaCarousel from "embla-carousel-solid";

export default function PMCarousel() {
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
      updateCanScroll();
   });

   const scrollPrev = () => {
      if (api) api.scrollPrev();
      updateCanScroll();
   };

   const scrollNext = () => {
      if (api) api.scrollNext();
      updateCanScroll();
   };

   return (
      <div class="embla" ref={emblaRef}>
         <div class="embla__container">
            <div class="embla__slide">Slide 1</div>
            <div class="embla__slide">Slide 2</div>
            <div class="embla__slide">Slide 3</div>
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
