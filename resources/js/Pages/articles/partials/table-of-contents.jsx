import { useEffect, useState } from 'react';
import { cn, kebabCase } from '@/lib/utils';

export function TableOfContents({ articleId }) {
    const [headings, setHeadings] = useState([]);

    useEffect(() => {
        const elements = Array.from(document.querySelectorAll('.prose h2:not(.txteadf), .prose h3, .prose h4')).map(
            (elem) => ({
                id: elem.id,
                text: elem.innerText,
                level: Number(elem.nodeName.charAt(1)),
            }),
        );

        setHeadings(elements);
    }, [articleId]);

    const getClassName = (level) => {
        switch (level) {
            case 2:
                return 'ml-0';
            case 3:
                return 'ml-3 toc-ch-2';
            case 4:
                return 'ml-6 toc-ch-3';
            default:
                return '';
        }
    };

    return (
        <aside className="hidden rounded-lg border bg-secondary/10 p-4 lg:block">
            <h3 className="mb-2 text-lg font-semibold tracking-tight">Table of Contents</h3>
            <div className="txteadf max-h-96 overflow-y-auto">
                <ul className="flex flex-col gap-y-2">
                    {headings.map((heading, index) => (
                        <li
                            key={index}
                            className={cn(
                                getClassName(heading.level),
                                'text-sm tracking-tighter text-foreground/70 transition first:hidden hover:text-foreground [&>a.active]:font-semibold [&>a.active]:text-foreground',
                            )}
                        >
                            <a href={`#content-${kebabCase(heading.text)}`}>{heading.text}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
