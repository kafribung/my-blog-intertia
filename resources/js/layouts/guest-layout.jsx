import { Logo } from '@/components/logo';
import { Link } from '@inertiajs/react';

export function GuestLayout({ children }) {
    const appName = import.meta.env.VITE_APP_NAME;
    return (
        <div className="flex items-center justify-center sm:min-h-screen">
            <div className="w-full max-w-lg py-6">
                <Link href="/" className="mb-6 flex items-center justify-center gap-x-2">
                    <Logo className="size-10" />
                    <span className="sr-only">Go to {appName} (Home)</span>
                </Link>
                {children}
            </div>
        </div>
    );
}
