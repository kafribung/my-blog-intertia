import { cn } from '@/lib/utils';

export function InputErrorMessage({ className, message, ...props }) {
    return (
        <p {...props} className={cn('text-danger mt-1 text-sm first-letter:uppercase', className)}>
            {message}
        </p>
    );
}
