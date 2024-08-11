import { onMount } from "solid-js";
import type { EmblaCarouselType } from "embla-carousel";
import createEmblaCarousel from "embla-carousel-solid";

export default function PMCarousel() {
   const [emblaRef, emblaApi] = createEmblaCarousel();
   let api: EmblaCarouselType | undefined;

   onMount(() => {
      api = emblaApi();
      if (api) console.log(api.slideNodes());
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
            <div class="embla__slide">Slide 1</div>
            <div class="embla__slide">Slide 2</div>
            <div class="embla__slide">Slide 3</div>
         <div class="embla__buttons">
            <button class="embla__prev" onClick={scrollPrev}>
               &larr;
            </button>
            <button class="embla__next" onClick={scrollNext}>
               &rarr;
            </button>
         </div>
         <button class="embla__prev" onClick={scrollPrev}>
            Prev
         </button>
         <button class="embla__next" onClick={scrollNext}>
            Next
         </button>
      </div>
   );
}
