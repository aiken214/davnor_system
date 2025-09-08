import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'OPCRs',
        href: '/opcrs',
    },
    {
        title: 'Create OPCR',
        href: '/opcrs',
    },
];

export default function Dashboard() {

    const { data, setData, post, errors, processing } = useForm<{
        title: string;
        period: string;
        rating: number | '';
        rater: string;
        file: File | null;
        // status: string;
    }>({
        title: '',
        period: '',
        rating: '',
        rater: '',
        file: null,
        // status: '',
    });

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/opcrs');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create OPCR" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">Create OPCR</div>
                        <Button>
                            <Link href="/opcrs"
                                preserveState={false}
                                preserveScroll={false}
                            >
                                Back
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <form onSubmit={handleFormSubmit}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                            Title
                                        </Label>
                                        <Input
                                            type="text"
                                            id="title"
                                            placeholder="Enter OPCR title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            aria-invalid={!!errors.title}
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="period" className="block text-sm font-medium text-gray-700">
                                            Rating Period
                                        </Label>
                                        <Input
                                            type="text"
                                            id="period"
                                            placeholder="Enter OPCR rating period"
                                            value={data.period}
                                            onChange={(e) => setData('period', e.target.value)}
                                            aria-invalid={!!errors.period}
                                        />
                                        <InputError message={errors.period} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                                            Rating
                                        </Label>
                                        <Input
                                            type="number"
                                            step="0.01" // ✅ Allows decimal input
                                            id="rating"
                                            placeholder="Enter OPCR rating"
                                            value={data.rating}
                                            onChange={(e) => setData('rating', parseFloat(e.target.value))}
                                            aria-invalid={!!errors.rating}
                                        />
                                        <InputError message={errors.rating} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="rater" className="block text-sm font-medium text-gray-700">
                                            Rater
                                        </Label>
                                        <Input
                                            type="text"
                                            id="rater"
                                            placeholder="Enter OPCR rater"
                                            value={data.rater}
                                            onChange={(e) => setData('rater', e.target.value)}
                                            aria-invalid={!!errors.rater}
                                        />
                                        <InputError message={errors.rater} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="file" className="block text-sm font-medium text-gray-700">
                                            File (PDF)
                                        </Label>
                                        <Input
                                            type="file"
                                            id="file"
                                            accept="application/pdf" // ✅ Accept only PDF files
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setData('file', file);
                                                }
                                            }}
                                            aria-invalid={!!errors.file}
                                        />
                                        <InputError message={errors.file} />

                                        {data.file && (
                                            <div className="mt-2">
                                                <embed
                                                    src={URL.createObjectURL(data.file as Blob)}
                                                    type="application/pdf"
                                                    className="w-full h-64 border"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* <div className="col-span-2 md:col-span-1">
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={data.status} onValueChange={(e) => setData('status', e)}>
                                            <SelectTrigger id="status" aria-invalid={!!errors.status}>
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Approved</SelectItem>
                                                <SelectItem value="0">Pending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.status} />
                                    </div> */}

                                    <div className="mt-4 text-end">
                                        <Button size={'lg'} type="submit" disabled={processing} variant="default">
                                            {processing && <Loader2 className="animate-spin" />}
                                            <span>Save</span>
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
