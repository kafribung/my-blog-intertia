import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useForm } from '@inertiajs/react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useEffect } from 'react';

export function CommentForm(props) {
    const { data, post, setData, reset, processing, errors } = useForm({
        body: props.attributes.body ?? '',
        parent_id: props.attributes?.item?.id,
        _method: props.attributes.method,
    });

    function submit(e) {
        e.preventDefault();
        post(props.attributes.url, {
            onSuccess: () => {
                reset();
                props.setOpen(false);
            },
            preserveScroll: true,
        });
    }

    useEffect(() => {
        setData('body', props.attributes.body ?? '');
    }, [props.attributes.body]);

    return (
        <div>
            <Sheet open={props.open} onOpenChange={props.setOpen}>
                <SheetContent side="bottom" className="mx-auto w-full max-w-xl rounded-t-xl border-x">
                    <form onSubmit={submit}>
                        <div className="flex">
                            <Avatar>
                                <AvatarImage src={props.auth.user.gravatar} />
                            </Avatar>

                            <div className="ml-3 w-full space-y-2.5">
                                <h4 className="text-sm font-semibold">{props.auth.user.name}</h4>
                                <Textarea value={data.body} onChange={(e) => setData('body', e.target.value)} />
                                <div className="flex items-center justify-between">
                                    <Button variant="outline">Cancel</Button>
                                    <Button disabled={processing || data.body === ''} type="submit">
                                        {props.attributes.submitText}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    );
}
