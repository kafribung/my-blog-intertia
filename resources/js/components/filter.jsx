import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconChevronDown } from '@irsyadadl/paranoid';

export const filters = [
    {
        name: 'Popular this week',
        href: '/articles/week',
    },
    {
        name: 'Popular this month',
        href: '/articles/month',
    },
    {
        name: 'Popular this year',
        href: '/articles/year',
    },
    {
        name: 'Popular this all time',
        href: '/articles/all-time',
    },
    {
        name: 'Trending',
        href: '/articles/trending',
    },
    {
        name: 'Most Likes',
        href: '/articles/most-likes',
    },
    {
        name: 'Latest',
        href: '/articles',
    },
];

export function Filter() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={cn(
                    'group flex items-center p-4 text-sm text-muted-foreground transition duration-200 hover:text-foreground focus:outline-none',
                    'data-[state=open]:text-foreground',
                )}
            >
                Filter
                <IconChevronDown className="ml-2 size-4 duration-200 group-data-[state=open]:rotate-180" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                {filters.map((filter) => (
                    <DropdownMenuItem asChild key={filter.name}>
                        <Link href={filter.href}>{filter.name}</Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function FilterResponsive() {
    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>Filter</DropdownMenuSubTrigger>
            <DropdownMenuSubContent sideOffset={-32}>
                {filters.map((filter) => (
                    <DropdownMenuItem key={filter.name} asChild>
                        <Link href={filter.href}>{filter.name}</Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    );
}
