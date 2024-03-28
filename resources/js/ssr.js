import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import ReactDOMServer from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        resolve: (name) => {
            const pages = import.meta.glob('./pages/**/*.jsx', { eager: true });
            return pages[`./pages/${name}.jsx`];
        },
        // setup: ({ App, props }) => <App {...props} />,
        setup({ el, App, props }) {
            // -     createRoot(el).render(<App {...props} />)
            hydrateRoot(el, <App {...props} />);
        },
    }),
);
