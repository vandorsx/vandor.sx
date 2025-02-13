export default function FeedSkeleton({ postCount }: { postCount: number }) {
   const timestampOptions = ["w-[96px]", "w-[128px]"];
   const marginOptions = ["my-3", "my-6"];
   const firstTextLineOptions = ["w-[600px]", "w-[550px]", "w-[500px]"];
   const secondTextLineOptions = ["w-[500px]", "w-[450px]", "w-[400px]"];
   const thirdTextLineOptions = ["w-[400px]", "w-[350px]", "w-[300px]"];

   function numberOfTextLines() {
      const weights = [
         { value: 1, weight: 1 },
         { value: 2, weight: 2 },
         { value: 3, weight: 3 },
      ];

      const totalWeight = weights.reduce(
         (sum, current) => sum + current.weight,
         0,
      );

      let random = Math.random() * totalWeight;

      for (let i = 0; i < weights.length; i++) {
         if (random < weights[i].weight) {
            return weights[i].value;
         }
         random -= weights[i].weight;
      }
   }

   return (
      <div>
         {Array.from({ length: postCount }).map((_, index) => {
            const lines = numberOfTextLines();
            if (!lines) {
               return;
            }

            const timestampWidth =
               timestampOptions[
                  Math.floor(Math.random() * timestampOptions.length)
               ];

            const firstTextLineWidth =
               firstTextLineOptions[
                  Math.floor(Math.random() * firstTextLineOptions.length)
               ];
            const secondTextLineWidth =
               secondTextLineOptions[
                  Math.floor(Math.random() * secondTextLineOptions.length)
               ];
            const thirdTextLineWidth =
               thirdTextLineOptions[
                  Math.floor(Math.random() * thirdTextLineOptions.length)
               ];

            return (
               <>
                  <div class="animate-pulse">
                     <div class="flex items-center gap-2 pb-2.5">
                        <div
                           class={`mr-1 h-[10px] ${timestampWidth} rounded-[2px] bg-black/[.03]`}
                        ></div>
                     </div>
                     <div>
                        {lines >= 1 && (
                           <div
                              class={`${Math.random() < 0.25 ? "mb-6" : ""} ${marginOptions[0]} h-[12px] ${firstTextLineWidth} max-w-full rounded-[2px] bg-black/[.07]`}
                           ></div>
                        )}

                        {lines >= 2 && (
                           <div
                              class={`${Math.random() < 0.25 ? "mb-6" : ""} my-3 h-[12px] ${secondTextLineWidth} max-w-full rounded-[2px] bg-black/[.07]`}
                           ></div>
                        )}

                        {lines >= 3 && (
                           <div
                              class={`${Math.random() < 0.25 ? "mb-6" : ""} my-3 h-[12px] ${thirdTextLineWidth} max-w-full rounded-[2px] bg-black/[.07]`}
                           ></div>
                        )}

                        {Math.random() < 0.25 && (
                           <div class="mx-auto my-6 h-[384px] w-full rounded-[2px] bg-black/[.03]"></div>
                        )}
                     </div>
                  </div>
                  {index < postCount - 1 && (
                     <hr class="mt-7 mb-5 w-full border-black/[.027]" />
                  )}
               </>
            );
         })}
      </div>
   );
}
