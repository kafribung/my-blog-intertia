import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { InputErrorMessage } from '@/components/input-error-message';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthenticatedCard } from '@/components/authenticated-card';
import { GuestLayout } from '@/layouts/guest-layout';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'));
    };

    const onChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    return (
        <>
            <Head title="Reset Password" />

            <AuthenticatedCard title="Reset Password" description="Enter your new password below">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <Label htmlFor="email">Email</Label>

                        <Input
                            className="mt-1"
                            type="email"
                            name="email"
                            value={data.email}
                            autoComplete="username"
                            onChange={onChange}
                        />

                        <InputErrorMessage message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <Label htmlFor="password">Password</Label>

                        <Input
                            className="mt-1"
                            type="password"
                            name="password"
                            value={data.password}
                            autoComplete="new-password"
                            autoFocus
                            onChange={onChange}
                        />

                        <InputErrorMessage message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <Label htmlFor="password_confirmation">Confirm Password</Label>

                        <Input
                            className="mt-1"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            autoComplete="new-password"
                            onChange={onChange}
                        />

                        <InputErrorMessage message={errors.password_confirmation} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-between">
                        <Button asChild variant="outline">
                            <Link href="/login">Cancel</Link>
                        </Button>
                        <Button type="submit" className="ml-4" disabled={processing}>
                            Reset Password
                        </Button>
                    </div>
                </form>
            </AuthenticatedCard>
        </>
    );
}

ResetPassword.layout = (page) => <GuestLayout children={page} />;
