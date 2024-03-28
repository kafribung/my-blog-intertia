import { AppLayout } from '@/layouts/app-layout';
import { Container } from '@/components/container';
import { Head } from '@inertiajs/react';

export default function Home() {
    return (
        <div>
            <Head title="Home" />
            <Container>Home page</Container>
        </div>
    );
}

Home.layout = (page) => <AppLayout children={page} />;
