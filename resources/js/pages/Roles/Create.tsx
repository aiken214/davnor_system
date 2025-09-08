import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Label } from '@radix-ui/react-label';
import { Loader2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Roles',
        href: '/roles',
    },
];

interface CreateProps {
    permissions: string[];
}

export default function Create({ permissions }: CreateProps) {
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        permissions: [] as string[],
    });

    function handleCheckboxChange(permissionName: string, checked: boolean) {
        if (checked) {
            setData('permissions', [...data.permissions, permissionName]);
        } else {
            setData(
                'permissions',
                data.permissions.filter((name) => name !== permissionName)
            );
        }
    }

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/roles');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">Create Role</div>
                        <Button>
                            <Link href="/roles" preserveState={false} preserveScroll={false}>
                                Back
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Enter role name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        aria-invalid={!!errors.name}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {/* Permissions */}
                                <div className="space-y-2">
                                    <Label className="block text-sm font-medium text-gray-700">
                                        Permissions
                                    </Label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {permissions.map((permission) => (
                                            <label key={permission} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    value={permission}
                                                    checked={data.permissions.includes(permission)}
                                                    onChange={(e) =>
                                                        handleCheckboxChange(permission, e.target.checked)
                                                    }
                                                    className="form-checkbox h-4 w-4 text-blue-600"
                                                />
                                                <span className="text-gray-800 capitalize">{permission}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <InputError message={errors.permissions} />
                                </div>

                                {/* Submit */}
                                <div className="mt-4 text-end">
                                    <Button size="lg" type="submit" disabled={processing}>
                                        {processing && <Loader2 className="animate-spin mr-2" />}
                                        <span>Save</span>
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
