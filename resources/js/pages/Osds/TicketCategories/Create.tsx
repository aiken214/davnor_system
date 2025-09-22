import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { type BreadcrumbItem } from '@/types';

type CreateTicketCategoryProps = {
    offices: {
        id: number;
        name: string;
    }[];
};

export default function CreateTicketCategory({ offices }: CreateTicketCategoryProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Ticket Categories', href: '/ticket-categories' },
        { title: 'Create Ticket Categories', href: '#' },
    ];

    const { data, setData, post, errors, processing } = useForm({
        name: '',
        description: '',
        office_id: '',
    });

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/ticket-categories');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Ticket Category" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">
                            Create Ticket Categories
                        </div>
                        <Button asChild>
                            <Link href="/ticket-categories">Back</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <form onSubmit={handleFormSubmit}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            type="text"
                                            id="name"
                                            placeholder="Enter category name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            aria-invalid={!!errors.name}
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Input
                                            type="text"
                                            id="description"
                                            placeholder="Enter category description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            aria-invalid={!!errors.description}
                                            required
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="office_id">Responsible Office</Label>
                                        <select
                                            id="office_id"
                                            value={data.office_id}
                                            onChange={(e) => setData('office_id', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                            required
                                        >
                                            <option value="">Select a responsible office</option>
                                            {offices.map((office) => (
                                                <option key={office.id} value={office.id}>
                                                    {office.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.office_id} />
                                    </div>

                                    <div className="mt-4 text-end">
                                        <Button type="submit" size="lg" disabled={processing}>
                                            {processing && <Loader2 className="animate-spin mr-2" />}
                                            Save
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
