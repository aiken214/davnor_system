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
        title: 'Create School',
        href: '/schools',
    },
];

interface District {
    id: number;
    name: string;
    division: {
        id: number;
        name: string;
    };
}

export default function SchoolCreate({ districts }: { districts: District[] }) {
    const { data, setData, post, errors, processing } = useForm<{
        name: string;
        depedsch_id: number | '';
        address: string;
        contact_number: number | '';
        email: string;
        district_id: string;
    }>({
        name: '',
        depedsch_id: '',
        address: '',
        contact_number: '',
        email: '',
        district_id: '',
    });

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/schools');
    }

    // Group districts by division name
    const groupedDistricts = districts.reduce((acc, district) => {
        const divisionName = district.division.name;
        if (!acc[divisionName]) acc[divisionName] = [];
        acc[divisionName].push(district);
        return acc;
    }, {} as Record<string, District[]>);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create School" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">Create School</div>
                        <Button>
                            <Link href="/schools" preserveState={false} preserveScroll={false}>
                                Back
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                {/* School Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter school name"
                                        aria-invalid={!!errors.name}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {/* DepEd School ID */}
                                <div className="space-y-2">
                                    <Label htmlFor="depedsch_id">School ID</Label>
                                    <Input
                                        type="number"
                                        id="depedsch_id"
                                        value={data.depedsch_id}
                                        onChange={(e) => setData('depedsch_id', parseFloat(e.target.value))}
                                        placeholder="Enter DepEd School ID"
                                        aria-invalid={!!errors.depedsch_id}
                                    />
                                    <InputError message={errors.depedsch_id} />
                                </div>

                                {/* Address */}
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        type="text"
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="Enter address"
                                        aria-invalid={!!errors.address}
                                    />
                                    <InputError message={errors.address} />
                                </div>

                                {/* Contact Number */}
                                <div className="space-y-2">
                                    <Label htmlFor="contact_number">Contact Number</Label>
                                    <Input
                                        type="number"
                                        id="contact_number"
                                        value={data.contact_number}
                                        onChange={(e) => setData('contact_number', parseFloat(e.target.value))}
                                        placeholder="Enter contact number"
                                        aria-invalid={!!errors.contact_number}
                                    />
                                    <InputError message={errors.contact_number} />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Enter email"
                                        aria-invalid={!!errors.email}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {/* District Dropdown with optgroup */}
                                <div className="space-y-2">
                                    <Label htmlFor="district_id">District</Label>
                                    <select
                                        id="district_id"
                                        value={data.district_id}
                                        onChange={(e) => setData('district_id', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                    >
                                        <option value="">Select a District</option>
                                        {Object.entries(groupedDistricts).map(([divisionName, districts]) => (
                                            <optgroup key={divisionName} label={divisionName}>
                                                {districts.map((district) => (
                                                    <option key={district.id} value={district.id}>
                                                        {district.name}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                    <InputError message={errors.district_id} />
                                </div>

                                {/* Submit Button */}
                                <div className="mt-4 text-end">
                                    <Button size="lg" type="submit" disabled={processing} variant="default">
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
