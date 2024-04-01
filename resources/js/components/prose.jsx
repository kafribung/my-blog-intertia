import React, { useEffect, useRef } from 'react';
import highlightBlade from 'highlightjs-blade';
import ClipboardJS from 'clipboard';
import { usePage } from '@inertiajs/react';
import highlight from 'highlight.js';

const clipboardIcon = ` <svg class="copy" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 7.5V5.1C8 4.53995 8 4.25992 8.10899 4.04601C8.20487 3.85785 8.35785 3.70487 8.54601 3.60899C8.75992 3.5 9.03995 3.5 9.6 3.5H18.9C19.4601 3.5 19.7401 3.5 19.954 3.60899C20.1422 3.70487 20.2951 3.85785 20.391 4.04601C20.5 4.25992 20.5 4.53995 20.5 5.1V14.9C20.5 15.4601 20.5 15.7401 20.391 15.954C20.2951 16.1422 20.1422 16.2951 19.954 16.391C19.7401 16.5 19.4601 16.5 18.9 16.5H16.5M16.5 9.1V18.9C16.5 19.4601 16.5 19.7401 16.391 19.954C16.2951 20.1422 16.1422 20.2951 15.954 20.391C15.7401 20.5 15.4601 20.5 14.9 20.5H5.1C4.53995 20.5 4.25992 20.5 4.04601 20.391C3.85785 20.2951 3.70487 20.1422 3.60899 19.954C3.5 19.7401 3.5 19.4601 3.5 18.9V9.1C3.5 8.53995 3.5 8.25992 3.60899 8.04601C3.70487 7.85785 3.85785 7.70487 4.04601 7.60899C4.25992 7.5 4.53995 7.5 5.1 7.5H14.9C15.4601 7.5 15.7401 7.5 15.954 7.60899C16.1422 7.70487 16.2951 7.85785 16.391 8.04601C16.5 8.25992 16.5 8.53995 16.5 9.1Z" stroke="#a1a1aa" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
const clipboardCopiedIcon = `<svg class="check" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.5805 9.97493C15.8428 9.65434 15.7955 9.18183 15.4749 8.91953C15.1543 8.65724 14.6818 8.70449 14.4195 9.02507L10.4443 13.8837L9.03033 12.4697C8.73744 12.1768 8.26256 12.1768 7.96967 12.4697C7.67678 12.7626 7.67678 13.2374 7.96967 13.5303L9.96967 15.5303C10.1195 15.6802 10.3257 15.7596 10.5374 15.7491C10.749 15.7385 10.9463 15.6389 11.0805 15.4749L15.5805 9.97493Z" fill="#bef264"/>
</svg>
`;

export function Prose({ content }) {
    const { article } = usePage().props;

    useEffect(() => {
        let codeBlocks = document.querySelectorAll('.prose pre');
        let imgBlocks = document.querySelectorAll('.prose img');

        imgBlocks.forEach((element, key) => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('image-extended');
            [].forEach((value) => {
                wrapper.classList.add(value);
            });
            element.parentNode.insertBefore(wrapper, element);
            wrapper.appendChild(element);
        });

        codeBlocks.forEach((element, key) => {
            const wrapper = document.createElement('div');
            [].forEach((value) => {
                wrapper.classList.add(value);
            });

            element.parentNode.insertBefore(wrapper, element);
            wrapper.appendChild(element);
            let copyToClipboardBtn = document.createElement('button');
            copyToClipboardBtn.innerHTML = clipboardIcon;
            copyToClipboardBtn.id = `clipButton-${key}`;

            ['md:block', 'hidden'].forEach((value) => {
                copyToClipboardBtn.classList.add(value);
            });

            copyToClipboardBtn.setAttribute('aria-label', 'Copy to Clipboard');
            copyToClipboardBtn.setAttribute('title', 'Copy to Clipboard');
            copyToClipboardBtn.classList.add('copyBtn');

            wrapper.appendChild(copyToClipboardBtn);

            let copyToClipboard = new ClipboardJS(`#${copyToClipboardBtn.id}`);

            copyToClipboard.on('success', (element) => {
                copyToClipboardBtn.innerHTML = clipboardCopiedIcon;
                element.clearSelection();
                setTimeout(() => {
                    copyToClipboardBtn.innerHTML = clipboardIcon;
                }, 1500);
            });

            let codeElement = element.querySelector('code');
            codeElement.id = `clipText-${key}`;
            copyToClipboardBtn.dataset.clipboardTarget = `#${codeElement.id}`;
        });

        highlight.registerLanguage('blade', highlightBlade);
        highlight.highlightAll();
    }, [article.id]);

    return <CodeComponent children={content} />;
}

const CodeComponent = ({ children }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.querySelectorAll('[class*="language-"]').forEach((element) => {
            const classes = element.className.split(/\s+/);
            classes.forEach((classItem) => {
                const match = classItem.match(/^language-(.*)$/);
                if (match && match[1]) {
                    const languageIdentifier = match[1];
                    const codeContainer = element.closest('.code-container');
                    if (codeContainer) {
                        codeContainer.classList.add(languageIdentifier);
                    }
                }
            });
        });

        const tables = container.querySelectorAll('table');
        tables.forEach((table) => {
            const divElement = document.createElement('div');
            divElement.className = 'prose-table';
            table.parentNode?.insertBefore(divElement, table);
            divElement.appendChild(table);
        });
    }, [children]);

    return (
        <div
            ref={containerRef}
            className="prose max-w-3xl dark:prose-invert lg:prose-lg prose-headings:mb-2 prose-headings:font-bold prose-headings:tracking-tight prose-a:text-foreground prose-pre:m-0 prose-pre:rounded-none prose-pre:bg-transparent prose-pre:p-4 prose-pre:font-mono prose-thead:border-b-2 prose-thead:border-border/80 prose-tr:border-border/80 prose-img:rounded-none prose-img:ring-1 prose-img:ring-foreground/10 prose-hr:h-px prose-hr:border-0 prose-hr:bg-gradient-to-r prose-hr:from-accent/50 prose-hr:via-accent prose-hr:to-accent/50 md:prose-img:rounded-lg lg:prose-pre:px-5 lg:prose-pre:pb-4 [&>h2>a]:scroll-mt-8 [&>h3>a]:scroll-mt-8 [&>h4>a]:scroll-mt-8"
            dangerouslySetInnerHTML={{ __html: children }}
        />
    );
};
