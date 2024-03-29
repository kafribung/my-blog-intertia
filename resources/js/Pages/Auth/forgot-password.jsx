import { Head, Link, useForm } from '@inertiajs/react';
import { InputErrorMessage } from '@/components/input-error-message';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GuestLayout } from '@/layouts/guest-layout';
import { AuthenticatedCard } from '@/components/authenticated-card';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password" />

            {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}

            <AuthenticatedCard
                title="Forgot Password"
                description="Forgot your password? No problem. Just let us know your email address and we will email you a password
                reset link that will allow you to choose a new one."
            >
                <form onSubmit={submit}>
                    <Input
                        type="text"
                        name="email"
                        value={data.email}
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputErrorMessage message={errors.email} className="mt-2" />

                    <div className="mt-4 flex items-center justify-between">
                        <Button asChild variant="outline">
                            <Link href="/login">Cancel</Link>
                        </Button>
                        <Button type="submit" className="ml-4" disabled={processing}>
                            Email Password Reset Link
                        </Button>
                    </div>
                </form>
            </AuthenticatedCard>
        </>
    );
}

ForgotPassword.layout = (page) => <GuestLayout children={page} />;
