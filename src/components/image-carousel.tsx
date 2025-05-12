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
        <div class="overflow-x-scroll overflow-y-hidden whitespace-nowrap">
            {Photos.map((photo) => {
                const fallbackExt = photo.exts[photo.exts.length - 1];

                return (
                    <picture class="inline-block">
                        {photo.exts.map((ext) => (
                            <source
                                srcset={`${photo.urlWithoutExt}.${ext}`}
                                type={`image/${ext}`}
                            />
                        ))}
                        <img
                            src={`${photo.urlWithoutExt}.${fallbackExt}`}
                            alt={photo.alt}
                            width={photo.dimensions[0]}
                            height={photo.dimensions[1]}
                        />
                    </picture>
                );
            })}
        </div>
    );
}
