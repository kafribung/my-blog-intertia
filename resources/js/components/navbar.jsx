import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Container } from '@/components/container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './ui/button';
import { IconChevronDown, IconSettings, IconSearch } from '@irsyadadl/paranoid';
import { Label } from '@/components/ui/label';
import { CommandPalette } from '@/components/command-palette';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { ResponsiveNavbar } from '@/components/responsive-navbar';
import { Filter } from './filter';

export function Navbar() {
    const { auth, categories_g } = usePage().props;
    const [open, setOpen] = useState(false);

    return (
        <>
            <CommandPalette open={open} setOpen={setOpen} />

            <nav className="border-b bg-secondary/50 py-1">
                <Container>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-2">
                            <Logo />
                            <NavLink href="/">Home</NavLink>
                            <NavLink href="/articles">Articles</NavLink>
                            <Filter />
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    className={cn(
                                        'group flex items-center p-4 text-sm text-muted-foreground transition duration-200 hover:text-foreground focus:outline-none',
                                        'data-[state=open]:text-foreground',
                                    )}
                                >
                                    Categories
                                    <IconChevronDown className="ml-2 size-4 duration-200 group-data-[state=open]:rotate-180" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    {categories_g.map((category) => (
                                        <DropdownMenuItem key={category.id} asChild>
                                            <Link href={`/articles/categories/${category.slug}`}>{category.name}</Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="flex items-center gap-x-4">
                            <div className="flex items-center gap-x-1">
                                <Button
                                    size="icon"
                                    className="size-8 rounded-full [&_svg]:size-4 [&_svg]:text-muted-foreground"
                                    variant="ghost"
                                    onClick={() => setOpen(true)}
                                >
                                    <IconSearch />
                                </Button>
                                <ThemeToggle />
                            </div>
                            {auth.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="text-muted-foreground transition duration-200 hover:text-foreground focus:outline-none">
                                        <Avatar className="size-6 sm:size-8">
                                            <AvatarImage src={auth.user.gravatar} />
                                            <AvatarFallback>{auth.user.initials}</AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end">
                                        <DropdownMenuLabel className="space-y-0.5">
                                            <Label>{auth.user.name}</Label>
                                            <span className="block text-sm text-muted-foreground">
                                                {auth.user.email}
                                            </span>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard">Dashboard</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={route('profile.edit')}
                                                className="flex items-center justify-between [&_svg]:size-4 [&_svg]:text-muted-foreground"
                                            >
                                                Settings
                                                <IconSettings />
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild className="w-full">
                                            <Link href="/logout" as="button" method="post">
                                                Logout
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button asChild variant="outline">
                                    <Link href="/login">Login</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </Container>
            </nav>

            <ResponsiveNavbar open={open} setOpen={setOpen} />
        </>
    );
}

export function NavLink({ className, ...props }) {
    return (
        <Link
            className={cn('p-4 text-sm text-muted-foreground transition duration-200 hover:text-foreground', className)}
            {...props}
        />
    );
}
