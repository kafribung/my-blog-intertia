import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { IconHeart, IconMessage } from '@irsyadadl/paranoid';
import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { CommentForm } from '@/pages/articles/comments/comment-form';
import { CommentOptions } from './comment-options';

export function CommentBlock({ comments }) {
    const { auth, article } = usePage().props;
    const [open, setOpen] = useState(false);
    const [attributes, setAttributes] = useState({
        body: '',
        url: '',
        method: 'post',
        item: {},
        submitText: 'Reply',
    });
    return (
        <div className="space-y-6">
            {comments.map((comment, i) => (
                <div key={i} className="flex">
                    <Avatar className="mr-3 size-8">
                        <AvatarImage src={comment.user.gravatar} />
                    </Avatar>

                    <div className="relative w-full">
                        {auth.user && <CommentOptions comment={comment} article={article} />}
                        <h4 className="text-sm font-semibold">{comment.user.name}</h4>
                        <div className="prose prose-gray text-muted-foreground dark:prose-invert">{comment.body}</div>
                        <div className="flex items-center gap-x-2 [&_button]:size-7 [&_button]:rounded-full [&_svg]:size-4">
                            {comment.can_be_replied && (
                                <Button
                                    onClick={() => {
                                        setOpen(true);
                                        setAttributes({
                                            ...attributes,
                                            body: null,
                                            url: route('comments.reply', [comment]),
                                            item: comment,
                                            submitText: 'Reply',
                                        });
                                    }}
                                    size="icon"
                                    variant="ghost"
                                >
                                    <IconMessage />
                                </Button>
                            )}
                            <div className="flex items-center">
                                <Link
                                    as="button"
                                    method="post"
                                    preserveScroll
                                    href={route('comments.like', [comment])}
                                    className={buttonVariants({
                                        size: 'icon',
                                        variant: 'ghost',
                                    })}
                                >
                                    <IconHeart className="size-4 shrink-0" />
                                </Link>
                                {comment.likes_count > 0 && (
                                    <span className="ml-1 font-mono text-[0.800rem] text-muted-foreground">
                                        {comment.likes_count}
                                    </span>
                                )}
                            </div>
                        </div>
                        {comment.children.length > 0 && (
                            <div className="mt-6">
                                <CommentBlock article={article} auth={auth} comments={comment.children} />
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {auth.user && <CommentForm auth={auth} open={open} setOpen={setOpen} attributes={attributes} />}
        </div>
    );
}
