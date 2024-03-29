import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { InputErrorMessage } from '@/components/input-error-message';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GuestLayout } from '@/layouts/guest-layout';
import { AuthenticatedCard } from '@/components/authenticated-card';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
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

        post(route('register'));
    };

    const onChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    return (
        <>
            <Head title="Register" />

            <AuthenticatedCard title="Create a new account" description="Or log in to your existing account">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <Label htmlFor="name">Name</Label>

                        <Input
                            type="text"
                            name="name"
                            value={data.name}
                            className="mt-1"
                            autoComplete="name"
                            autoFocus
                            onChange={onChange}
                            required
                        />

                        <InputErrorMessage message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>

                        <Input
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1"
                            autoComplete="username"
                            onChange={onChange}
                            required
                        />

                        <InputErrorMessage message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <Label htmlFor="password">Password</Label>

                        <Input
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1"
                            autoComplete="new-password"
                            onChange={onChange}
                            required
                        />

                        <InputErrorMessage message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <Label htmlFor="password_confirmation">Confirm Password</Label>

                        <Input
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1"
                            onChange={onChange}
                            required
                        />

                        <InputErrorMessage message={errors.password_confirmation} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-between">
                        <Button asChild variant="outline">
                            <Link href="/login">Login</Link>
                        </Button>

                        <Button type="submit" className="ml-4" disabled={processing}>
                            Register
                        </Button>
                    </div>
                </form>
            </AuthenticatedCard>
        </>
    );
}

Register.layout = (page) => <GuestLayout children={page} />;
