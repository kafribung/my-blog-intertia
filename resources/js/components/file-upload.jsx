import { IconGallery, IconX } from '@irsyadadl/paranoid';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function FileUpload({ className, onChange }) {
    const [previewSrc, setPreviewSrc] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files ? event.target.files[0] : null;
        onChange(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewSrc(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewSrc(null);
        }
    };

    return (
        <div className={cn(className)}>
            {previewSrc ? (
                <div className="relative rounded-lg">
                    <img
                        src={String(previewSrc)}
                        alt="Preview"
                        className="max-h-96 w-full rounded-lg border object-cover object-center"
                    />
                    <Button
                        className="absolute -right-3 -top-3 size-6 rounded-full"
                        size="icon"
                        variant="secondary"
                        type="button"
                        onClick={() => setPreviewSrc(null)}
                    >
                        <IconX className="size-4" />
                    </Button>
                </div>
            ) : null}
            <Input className="mt-2 max-w-[14rem] file:text-foreground" onChange={handleFileChange} type="file" />
        </div>
    );
}
