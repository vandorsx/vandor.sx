type Props = {
    urlWithoutExt: string;
    exts: string[];
    dimensions: [number, number];
    alt?: string;
};

export default function Image({ urlWithoutExt, exts, dimensions, alt }: Props) {
    const fallbackExt = exts[exts.length - 1];

    return (
        <picture class="border-figure-outline inline-block max-w-xl border p-1.5">
            {exts.map((ext) => (
                <source
                    srcset={`${urlWithoutExt}.${ext}`}
                    type={`image/${ext}`}
                    width={dimensions[0]}
                    height={dimensions[1]}
                />
            ))}
            <img
                src={`${urlWithoutExt}.${fallbackExt}`}
                alt={alt}
                width={dimensions[0]}
                height={dimensions[1]}
                class="bg-figure-outline/25 h-auto max-h-[605px] w-auto"
            />
        </picture>
    );
}
