import { Avatar, AvatarImage } from '@/components/ui/avatar';

export function Author({ user }) {
    return (
        <div className="flex gap-3">
            <Avatar className="size-8">
                <AvatarImage src={user.gravatar} />
            </Avatar>
            <div>
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm text-muted-foreground">Author of article.</div>
            </div>
        </div>
    );
}
