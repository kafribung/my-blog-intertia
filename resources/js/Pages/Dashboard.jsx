import { Container } from '@/components/container';
import { Head } from '@inertiajs/react';
import { UserLayout } from '@/layouts/user-layout';

export default function Dashboard() {
    return (
        <div>
            <Head title="Dashboard" />
            <Container>Dashboard page</Container>
        </div>
    );
}

Dashboard.layout = (page) => <UserLayout title="Dashboard" children={page} />;
