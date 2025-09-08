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

type EditDcpRecipientProps = {
    dcp: { id: number };
    schools: Option[];
    dcp_recipient: {
        id: number;
        allocation: number | '';
        date_delivery: string;
        school_id: number;
        dcp_id: number;
        remarks: string;
        file: string | null;
    };
};

interface Option {
    id: number;
    name: string;
}

export default function EditDcpRecipient({ schools, dcp_recipient }: EditDcpRecipientProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'DCPs',
            href: '/dcps',
        },
        {
            title: 'DCP Recipients',
            href: `/dcp-recipients/${dcp_recipient.dcp_id}`,
        },
        {
            title: 'Edit DCP Recipient',
            href: '',
        },
    ];

    const { data, setData, post, errors, processing } = useForm<{
        _method: string;
        dcp_id: number;
        allocation: number | '';
        date_delivery: string;
        school_id: string;
        remarks: string;
        file: File | null;
    }>({
        _method: 'put',
        dcp_id: dcp_recipient.id,
        allocation: dcp_recipient.allocation,
        date_delivery: dcp_recipient.date_delivery,
        school_id: dcp_recipient.school_id.toString(),
        remarks: dcp_recipient.remarks,
        file: null,
    });

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(`/dcp-recipients/${dcp_recipient.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit DCP Recipient" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">Edit DCP Recipient</div>
                        <Button asChild>
                            <Link href={`/dcp-recipients/${dcp_recipient.dcp_id}`}>Back</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <form onSubmit={handleFormSubmit}>
                                <div className="space-y-4">

                                    {/* School */}
                                    <div className="space-y-2">
                                        <Label htmlFor="school_id">School</Label>
                                        <select
                                            id="school_id"
                                            value={data.school_id}
                                            onChange={(e) => setData('school_id', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                        >
                                            <option value="">Select School</option>
                                            {schools?.map((school) => (
                                                <option key={school.id} value={school.id}>
                                                    {school.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.school_id} />
                                    </div>

                                    {/* Allocation */}
                                    <div className="space-y-2">
                                        <Label htmlFor="allocation">No. of Package</Label>
                                        <Input
                                            type="number"
                                            id="allocation"
                                            value={data.allocation}
                                            onChange={(e) => setData('allocation', parseInt(e.target.value))}
                                        />
                                        <InputError message={errors.allocation} />
                                    </div>

                                    {/* Delivery Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="date_delivery">Delivery Date</Label>
                                        <Input
                                            type="date"
                                            id="date_delivery"
                                            value={data.date_delivery}
                                            onChange={(e) => setData('date_delivery', e.target.value)}
                                        />
                                        <InputError message={errors.date_delivery} />
                                    </div>

                                    {/* Remarks */}
                                    <div className="space-y-2">
                                        <Label htmlFor="remarks">Remarks</Label>
                                        <textarea
                                            id="remarks"
                                            value={data.remarks}
                                            onChange={(e) => setData('remarks', e.target.value)}
                                            rows={3}
                                            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        />
                                        <InputError message={errors.remarks} />
                                    </div>

                                    {/* File */}
                                    <div className="space-y-2">
                                        <Label htmlFor="file">Replace File (PDF)</Label>
                                        <Input
                                            type="file"
                                            id="file"
                                            accept="application/pdf"
                                            onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                                        />
                                        <InputError message={errors.file} />

                                        {dcp_recipient.file && !data.file && (
                                            <div className="mt-2">
                                                <embed
                                                    src={`/storage/${dcp_recipient.file}`}
                                                    type="application/pdf"
                                                    className="w-full h-64 border"
                                                />
                                            </div>
                                        )}

                                        {data.file && (
                                            <div className="mt-2">
                                                <embed
                                                    src={URL.createObjectURL(data.file)}
                                                    type="application/pdf"
                                                    className="w-full h-64 border"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 text-end">
                                        <Button size="lg" type="submit" disabled={processing}>
                                            {processing && <Loader2 className="animate-spin mr-2" />}
                                            Update
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
