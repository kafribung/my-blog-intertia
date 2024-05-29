import { DeleteUserForm } from '@/pages/profile/partials/delete-user-form';
import { UpdatePasswordForm } from '@/pages/profile/partials/update-password-form';
import { UpdateProfileInformationForm } from '@/pages/profile/partials/update-profile-information-form';
import { Head } from '@inertiajs/react';
import { UserLayout } from '@/layouts/user-layout';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <>
            <Head title="Settings" />
            <div className="mx-auto max-w-7xl space-y-6">
                <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                <UpdatePasswordForm />
                <DeleteUserForm />
            </div>
        </>
    );
}

Edit.layout = (page) => <UserLayout title="Settings" children={page} />;
