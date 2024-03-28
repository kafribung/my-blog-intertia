import { Navbar } from '@/components/navbar';

export function AppLayout({ children }) {
    return (
        <div>
            <Navbar />
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 py-6 md:py-16">
                {children}
            </main>
        </div>
    );
}
