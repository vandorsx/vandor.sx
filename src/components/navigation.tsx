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
                <ol class="flex items-center">
                    {Links.map((link, index) => (
                        <li class="flex items-center">
                            {index === 0 && <span>~&nbsp;/&nbsp;</span>}
                            {index === Links.length - 1 ?
                                <span>{link.text}</span>
                            :   <a href={link.href} class="hyperlink">
                                    {link.text}
                                </a>
                            }
                            {index !== Links.length - 1 && (
                                <span>&nbsp;/&nbsp;</span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </div>
    );
}
