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

type CreateDcpItemProps = {
    dcp: { id: number };
    schools: Option[];
};

interface Option {
    id: number;
    name: string;
}

export default function CreateDcpRecipient({ dcp, schools }: CreateDcpItemProps) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'DCPs',
            href: '/dcps',
        },
        {
            title: 'Create DCP Recipient',
            href: '/dcp-recipients',
        },
    ];

    const { data, setData, post, errors, processing } = useForm<{
        dcp_id: number;
        allocation: number | '';
        date_delivery: string;
        school_id: string;
        remarks: string;
        file: File | null;
    }>({
        dcp_id: dcp.id,
        allocation: '',
        date_delivery: '',
        school_id: '',
        remarks: '',
        file: null,
    });

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/dcp-recipients');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create DCP Recipient" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">Create DCP Recipient</div>
                        <Button>
                            <Link href={`/dcp-recipients/${dcp.id}`}>
                                Back
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <form onSubmit={handleFormSubmit}>
                                <div className="space-y-4">

                                    {/* School Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor="school_id" className="block text-sm font-medium text-gray-700">School</Label>
                                        <select
                                            id="school_id"
                                            value={data.school_id}
                                            onChange={(e) => setData('school_id', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                        >
                                            <option value="">Select School</option>
                                            {schools.map((school) => (
                                                <option key={school.id} value={school.id}>
                                                    {school.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.school_id} />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="allocation" className="block text-sm font-medium text-gray-700">No. of Package</Label>
                                        <Input
                                            type="number"
                                            id="allocation"
                                            value={data.allocation}
                                            onChange={(e) => setData('allocation', parseFloat(e.target.value))}
                                        />
                                        <InputError message={errors.allocation} />
                                    </div>

                                    {/* Delivery Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="date_delivery" className="block text-sm font-medium text-gray-700">Delivery Date</Label>
                                        <Input
                                            type="date"
                                            id="date_delivery"
                                            value={data.date_delivery}
                                            onChange={(e) => setData('date_delivery', e.target.value)}
                                        />
                                        <InputError message={errors.date_delivery} />
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
                                        <Button
                                            size="lg"
                                            type="submit"
                                            disabled={processing}
                                            variant="default"
                                        >
                                            {processing && (
                                                <Loader2 className="animate-spin mr-2" />
                                            )}
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
