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
        title: 'Edit District',
        href: '/districts',
    },
];

interface Division {
    id: number;
    name: string;
}

interface District {
    id: number;
    name: string;
    division_id: number;
}

export default function DistrictEdit({ district, divisions }: { district: District; divisions: Division[] }) {
    const { data, setData, put, errors, processing } = useForm<{
        name: string;
        division_id: string;
    }>({
        name: district.name ?? '',
        division_id: district.division_id.toString(),
    });

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(`/districts/${district.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit District" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">Edit District</div>
                        <Button>
                            <Link href="/districts" preserveState={false} preserveScroll={false}>
                                Back
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                {/* District Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Name
                                    </Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        placeholder="Enter district name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        aria-invalid={!!errors.name}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {/* Division Dropdown */}
                                <div className="space-y-2">
                                    <Label htmlFor="division_id" className="block text-sm font-medium text-gray-700">
                                        Division
                                    </Label>
                                    <select
                                        id="division_id"
                                        value={data.division_id}
                                        onChange={(e) => setData('division_id', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                    >
                                        <option value="">Select a Division</option>
                                        {divisions.map((division) => (
                                            <option key={division.id} value={division.id}>
                                                {division.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.division_id} />
                                </div>

                                {/* Submit Button */}
                                <div className="mt-4 text-end">
                                    <Button size="lg" type="submit" disabled={processing} variant="default">
                                        {processing && <Loader2 className="animate-spin mr-2" />}
                                        <span>Update</span>
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
