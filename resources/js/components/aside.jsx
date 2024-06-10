import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export function AsideLink({ active = false, ...props }) {
    return (
        <Link
            className={cn(
                active ? 'font-semibold text-primary' : 'hover:text-primary',
                'text-sm transition-colors duration-200',
            )}
            {...props}
        />
    );
}

export function Aside() {
    return (
        <nav className="grid w-full gap-4 text-sm text-muted-foreground lg:sticky lg:top-10 lg:w-1/5">
            <AsideLink href={route('dashboard')} active={route().current('dashboard')}>
                Dashboard
            </AsideLink>
            <AsideLink href={route('profile.edit')} active={route().current('profile.edit')}>
                Settings
            </AsideLink>
            <AsideLink href={route('internal-articles.index')}>List Articles</AsideLink>
            <AsideLink href={route('categories.index')} active={route().current('categories.*')}>
                Categories
            </AsideLink>
            <AsideLink href="#">Tags</AsideLink>
            <AsideLink href="#">Comments</AsideLink>
        </nav>
    );
}
