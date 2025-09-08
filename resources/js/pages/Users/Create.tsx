import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Users',
        href: '/users',
    },
];

interface CreateProps {
    roles: string[];
}

export default function Create({ roles }: CreateProps) {
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        email: '',
        password: '',
        roles: [] as string[],
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
        post('/users');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">Create User</div>
                        <Button>
                            <Link href="/users" preserveState={false} preserveScroll={false}>
                                Back
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter user name"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            type="email"
                                            id="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Enter user email"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            type="password"
                                            id="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Enter password"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Roles */}
                                    <div className="space-y-2">
                                        <Label htmlFor="roles">Roles</Label>
                                        <div className="space-y-1">
                                            {roles.map((role: string) => (
                                                <label key={role} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        value={role}
                                                        onChange={(e) =>
                                                            handleCheckboxChange(role, e.target.checked)
                                                        }
                                                        id={role}
                                                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <span className="text-gray-800 capitalize">{role}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <InputError message={errors.roles} />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="text-end pt-2">
                                        <Button size="lg" type="submit" disabled={processing}>
                                            {processing && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                                            Submit
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
