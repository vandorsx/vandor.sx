type CarouselProps = {
    Photos: {
        urlWithoutExt: string;
        exts: string[];
        dimensions: [number, number];
        alt?: string;
    }[];
};

export default function ImageCarousel({ Photos }: CarouselProps) {
    return (
        <div>
            <span class="text-figure-outline text-right text-[12px]">
                {Photos.length} images
            </span>
            <div class="border-figure-outline border p-1.5">
                <div class="overflow-x-scroll overflow-y-hidden whitespace-nowrap">
                    {Photos.map((photo) => {
                        const fallbackExt = photo.exts[photo.exts.length - 1];

                        return (
                            <div class="inline-block align-middle not-last:pr-1.5">
                                <picture>
                                    {photo.exts.map((ext) => (
                                        <source
                                            srcset={`${photo.urlWithoutExt}.${ext}`}
                                            type={`image/${ext}`}
                                            width={photo.dimensions[0]}
                                            height={photo.dimensions[1]}
                                        />
                                    ))}
                                    <img
                                        src={`${photo.urlWithoutExt}.${fallbackExt}`}
                                        alt={photo.alt}
                                        width={photo.dimensions[0]}
                                        height={photo.dimensions[1]}
                                        class="h-auto max-h-[605px] w-auto"
                                    />
                                </picture>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
