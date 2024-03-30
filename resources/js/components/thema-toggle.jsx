import { IconMoon, IconMoonFill } from '@irsyadadl/paranoid';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';

export function ThemeToggle() {
    const { setTheme } = useTheme();

    return (
        <div className="[&_button]:size-8 [&_button]:place-content-center [&_button]:rounded-full [&_svg]:size-4 [&_svg]:text-muted-foreground">
            <Button size="icon" className="grid dark:hidden" variant="ghost" onClick={() => setTheme('dark')}>
                <Moon />
            </Button>
            <Button
                size="icon"
                variant="ghost"
                onClick={() => setTheme('light')}
                className="hidden hover:text-muted-foreground dark:grid"
            >
                <Moon className="fill-muted-foreground" />
            </Button>
        </div>
    );
}
