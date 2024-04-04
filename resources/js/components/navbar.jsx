import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Container } from '@/components/container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconChevronDown } from '@irsyadadl/paranoid';
import { Button } from './ui/button';

export function Navbar() {
    const { auth, categories_g } = usePage().props;

    return (
        <nav className="border-b bg-secondary/50 py-1">
            <Container>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                        <Logo />
                        <NavLink href="/">Home</NavLink>
                        <NavLink href="/articles">Articles</NavLink>
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
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="text-muted-foreground transition duration-200 hover:text-foreground focus:outline-none">
                                    <Avatar className="size-8">
                                        <AvatarImage src="{auth.user.gravatar}" />
                                        <AvatarFallback>{auth.user.initials}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard">Dashboard</Link>
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
