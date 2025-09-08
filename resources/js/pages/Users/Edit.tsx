import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Loader2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit User',
        href: '/users',
    },
];

interface EditProps {
    user: {
        id: number;
        name: string;
        email: string;
    };
    userRoles: string[];
    roles: string[];
}

export default function Edit({ user, userRoles, roles }: EditProps) {
    const { data, setData, put, errors, processing } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        roles: userRoles || [],
    });

    function handleCheckboxChange(roleName: string, checked: boolean) {
        if (checked) {
            setData('roles', [...data.roles, roleName]);
        } else {
            setData('roles', data.roles.filter((name) => name !== roleName));
        }
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(`/users/${user.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">Edit User</div>
                        <Button>
                            <Link href="/users" preserveState={false}>
                                Back
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter name"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Enter email"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Enter new password (optional)"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="roles">Roles</Label>
                                    <div className="grid gap-2">
                                        {roles.map((role) => (
                                            <label key={role} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    value={role}
                                                    checked={data.roles.includes(role)}
                                                    onChange={(e) => handleCheckboxChange(role, e.target.checked)}
                                                    className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="text-gray-800 capitalize">{role}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <InputError message={errors.roles} />
                                </div>

                                <div className="mt-4 text-end">
                                    <Button size="lg" type="submit" disabled={processing}>
                                        {processing && <Loader2 className="animate-spin mr-2" />}
                                        Update
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
