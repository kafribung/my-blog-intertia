import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { CommandDialog, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { router, usePage } from '@inertiajs/react';
import {
    IconCirclePerson,
    IconDashboard,
    IconHome,
    IconLogin,
    IconLogout,
    IconNotes,
    IconSettings,
    IconSketchbookFill,
} from '@irsyadadl/paranoid';

const cmdic = '!rounded-md !py-2 [&_svg]:!size-4 [&_svg]:text-muted-foreground [&_svg]:mr-2';
export function CommandPalette({ open, setOpen }) {
    const { auth } = usePage().props;
    const [results, setResults] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const down = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        window.addEventListener('keydown', down);
        return () => window.removeEventListener('keydown', down);
    }, []);

    const debouncedSearch = useCallback(
        debounce(async (value) => {
            const { data } = await axios(
                route('articles.search', {
                    search: value,
                }),
            );
            setResults(data);
        }, 500),
        [],
    );

    function searchHandler(value) {
        setSearch(value);
        debouncedSearch(value);
    }

    useEffect(() => {
        router.on('navigate', () => setOpen(false));
    }, []);

    return (
        <>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput value={search} onValueChange={searchHandler} placeholder="Type a command or search..." />
                <CommandList className="p-2">
                    {results.length > 0 ? (
                        results.map((article) => (
                            <CommandItem className={cmdic} key={article.id} onSelect={() => router.get(article.href)}>
                                <IconSketchbookFill />
                                {article.title}
                            </CommandItem>
                        ))
                    ) : (
                        <>
                            {auth.user ? (
                                <>
                                    <CommandItem className={cmdic} onSelect={() => router.get(route('dashboard'))}>
                                        <IconDashboard />
                                        Dashboard
                                    </CommandItem>
                                    <CommandItem className={cmdic} onSelect={() => router.get(route('profile.edit'))}>
                                        <IconSettings />
                                        Settings
                                    </CommandItem>
                                    <CommandItem
                                        className={cmdic}
                                        onSelect={() => router.get(route('internal-articles.index'))}
                                    >
                                        <IconNotes />
                                        List articles
                                    </CommandItem>
                                    <CommandItem className={cmdic} onSelect={() => router.post(route('logout'))}>
                                        <IconLogout />
                                        Log out
                                    </CommandItem>
                                </>
                            ) : (
                                <>
                                    <CommandItem className={cmdic} onSelect={() => router.get(route('home'))}>
                                        <IconHome />
                                        Home
                                    </CommandItem>
                                    <CommandItem className={cmdic} onSelect={() => router.get(route('articles.index'))}>
                                        <IconNotes />
                                        Articles
                                    </CommandItem>
                                    <CommandItem className={cmdic} onSelect={() => router.get(route('login'))}>
                                        <IconLogin />
                                        Login
                                    </CommandItem>
                                    <CommandItem className={cmdic} onSelect={() => router.get(route('register'))}>
                                        <IconCirclePerson />
                                        Register
                                    </CommandItem>
                                </>
                            )}
                        </>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}
