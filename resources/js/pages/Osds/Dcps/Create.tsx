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
        title: 'DCPs',
        href: '/dcps',
    },
    {
        title: 'Create DCP',
        href: '/dcps',
    },
];

export default function Create() {

    const { data, setData, post, errors, processing } = useForm<{
        batch: string;
        year: number | '';
        configuration: string;
        supplier: string;
        remarks: string;
        file: File | null;
    }>({
        batch: '',
        year: '',
        configuration: '',
        supplier: '',
        remarks: '',
        file: null,
    });

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/dcps');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create DCP Batch" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">Create DCP</div>
                        <Button>
                            <Link href="/dcps"
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
                                            Batch
                                        </Label>
                                        <Input
                                            type="text"
                                            id="title"
                                            placeholder="Enter DCP batch title"
                                            value={data.batch}
                                            onChange={(e) => setData('batch', e.target.value)}
                                            aria-invalid={!!errors.batch}
                                        />
                                        <InputError message={errors.batch} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="year" className="block text-sm font-medium text-gray-700">
                                            Year
                                        </Label>
                                        <Input
                                            type="number"
                                            id="year"
                                            placeholder="Enter batch year"
                                            value={data.year}
                                            onChange={(e) => setData('year', parseFloat(e.target.value))}
                                            aria-invalid={!!errors.year}
                                        />
                                        <InputError message={errors.year} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="configuration" className="block text-sm font-medium text-gray-700">
                                            Configuration
                                        </Label>
                                        <Input
                                            type="text"
                                            id="configuration"
                                            placeholder="Enter DCP batch configuration"
                                            value={data.configuration}
                                            onChange={(e) => setData('configuration', e.target.value)}
                                            aria-invalid={!!errors.configuration}
                                        />
                                        <InputError message={errors.configuration} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
                                            Supplier
                                        </Label>
                                        <Input
                                            type="text"
                                            id="supplier"
                                            placeholder="Enter DCP batch supplier"
                                            value={data.supplier}
                                            onChange={(e) => setData('supplier', e.target.value)}
                                            aria-invalid={!!errors.supplier}
                                        />
                                        <InputError message={errors.supplier} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                                            Remarks
                                        </Label>
                                        <textarea
                                            id="remarks"
                                            name="remarks"
                                            value={data.remarks}
                                            onChange={(e) => setData('remarks', e.target.value)}
                                            rows={3}
                                            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        />
                                        <InputError message={errors.remarks} />
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
