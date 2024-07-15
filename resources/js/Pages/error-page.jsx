import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';

export default function ErrorPage({ status }) {
    const errorMessages = {
        503: {
            title: 'Service Unavailable',
            description: 'Sorry, we are doing some maintenance. Please check back soon.',
        },
        500: { title: 'Server Error', description: 'Whoops, something went wrong on our servers.' },
        404: { title: 'Not Found', description: 'Sorry, the page you are looking for could not be found.' },
        403: { title: 'Forbidden', description: 'Sorry, you are forbidden from accessing this page.' },
        401: { title: 'Unauthorized', description: 'Sorry, you are unauthorized to access this page.' },
        429: { title: 'Too Many Requests', description: 'Please try again in just a second.' },
    }[status];

    return (
        <div className="grid min-h-screen place-content-center bg-background text-foreground">
            <Head title={errorMessages.title} />
            <Card>
                <CardHeader>
                    <CardTitle>{errorMessages.title}</CardTitle>
                    <CardDescription>{errorMessages.description}</CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
}
