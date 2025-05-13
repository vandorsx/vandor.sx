type NavigationProps = {
    Links: {
        href: string;
        text: string;
    }[];
};

export default function Navigation({ Links }: NavigationProps) {
    return (
        <div class="mb-7 flex gap-6 border-b px-1.5 pb-1.5 align-middle sm:gap-8 md:gap-16 lg:gap-24">
            <span class="text-even-slightly-smaller font-medium sm:text-base">
                <a href="mailto:jade@vandor.sx">jade@vandor.sx</a>
            </span>
            <nav class="text-even-slightly-smaller sm:text-base">
                <div>
                    {Links.length > 0 && <span>~&nbsp;/&nbsp;</span>}

                    {Links.map((link, index) => (
                        <>
                            {index === Links.length - 1 ?
                                <span class="break-words">{link.text}</span>
                            :   <a href={link.href} class="hyperlink">
                                    {link.text}
                                </a>
                            }
                            {index !== Links.length - 1 && (
                                <span>&nbsp;/&nbsp;</span>
                            )}
                        </>
                    ))}
                </div>
            </nav>
        </div>
    );
}
