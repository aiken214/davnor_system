import React from 'react';
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


type ResponseItem = {
    dcp_item_id: number;
    remarks: string;
    stolen: string;
} & {
    [K in 'working' | 'repairable' | 'replacement' | 'unrepairable']: number | string;
};

export default function Create({
        dcp_items,
        dcp_recipient,
    }: {
        dcp_items: any[];
        dcp_recipient: { id: number;[key: string]: any };
    }) {

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
            title: 'DCP Item Status',
            href: `/dcp-item-status/${dcp_recipient.id}`,
        },
        {
            title: 'Create DCP Item Status',
            href: '',
        },
    ];

    const { data, setData, post, processing } = useForm<{
        dcp_recipient_id: number;
        dcp_recipient: { id: number;[key: string]: any };
        responses: ResponseItem[];
    }>({
        dcp_recipient_id: dcp_recipient.id,
        dcp_recipient: dcp_recipient,
        responses: dcp_items.map((item) => ({
            dcp_item_id: item.id,
            working: '',
            repairable: '',
            replacement: '',
            unrepairable: '',
            stolen: '',
            remarks: '',
        })),
    });

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/dcp-item-status');
    };

    const handleChange = (
        index: number,
        field: 'working' | 'repairable' | 'replacement' | 'unrepairable' | 'stolen' | 'remarks',
        value: string
    ) => {
        const updated = [...data.responses];
        updated[index][field] = value;
        setData('responses', updated);
    };

    const renderNumberInput = (
        index: number,
        field: keyof Pick<ResponseItem, 'working' | 'repairable' | 'replacement' | 'unrepairable'>
    ) => (
        <input
            type="number"
            min="0"
            step="1"
            className="w-full p-1 text-sm border border-transparent"
            value={data.responses[index][field]}
            onChange={(e) => handleChange(index, field, e.target.value.replace(/\D/g, ''))}
        />
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create DCP Recipient" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">Create DCP Item Status</div>
                        <Button>
                            <Link href={`/dcp-item-status/${dcp_recipient.id}`}>Back</Link>

                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <table className="w-full border text-sm">
                                    <thead>
                                        <tr className="bg-slate-100">
                                            <th rowSpan={3} className="w-[4%] border px-3 py-2 text-center">#</th>
                                            <th rowSpan={3} className="border px-3 py-2 text-center">Items Description</th>
                                            <th rowSpan={3} className="border px-3 py-2 text-center">No. of Item Received</th>
                                            <th colSpan={6} className="border px-3 py-2 text-[16px] text-center">Status</th>
                                        </tr>
                                        <tr className="bg-slate-100">
                                            <th rowSpan={2} className="border px-3 py-2 text-center">Working
                                                <p className="text-[10px]">No. of working units</p>
                                            </th>
                                            <th colSpan={4} className="border px-3 py-2 text-center">Defective</th>
                                            <th rowSpan={2} className="border px-3 py-2 text-center">Remarks</th>
                                        </tr>
                                        <tr className="bg-slate-100">
                                            <th className="border px-2 py-2 text-center">For Repair
                                                <p className="text-[10px]">No. of units for repair</p>
                                            </th>
                                            <th className="border px-2 py-2 text-center">For Replacement
                                                <p className="text-[10px]">No. of units for replacement</p>
                                            </th>
                                            <th className="border px-2 py-2 text-center">Unrepairable
                                                <p className="text-[10px]">No. of units for replacement</p>
                                            </th>
                                            <th className="border px-2 py-2 text-center">Stolen
                                                <p className="text-[10px]">If stolen, please state the date<br></br> reported and other details.</p>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dcp_items.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} className="text-center text-gray-600 py-4">
                                                    ✅ All DCP items have already been added for this recipient.
                                                </td>
                                            </tr>
                                        ) : (
                                            dcp_items.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td className="border px-3 py-2 text-center">{index + 1}</td>
                                                    <td className="border px-3 py-2">{item.description}</td>
                                                    <td className="border px-3 py-2 text-center">{item.quantity}</td>
                                                    <td className="border px-0 py-0">{renderNumberInput(index, 'working')}</td>
                                                    <td className="border px-0 py-0">{renderNumberInput(index, 'repairable')}</td>
                                                    <td className="border px-0 py-0">{renderNumberInput(index, 'replacement')}</td>
                                                    <td className="border px-0 py-0">{renderNumberInput(index, 'unrepairable')}</td>
                                                    <td className="border px-0 py-0">
                                                        <textarea
                                                            name={`responses[${index}][stolen]`}
                                                            className="w-full text-sm p-1"
                                                            rows={2}
                                                            value={data.responses[index].stolen}
                                                            onChange={(e) => handleChange(index, 'stolen', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="border px-0 py-0">
                                                        <textarea
                                                            name={`responses[${index}][remarks]`}
                                                            className="w-full text-sm p-1"
                                                            rows={2}
                                                            value={data.responses[index].remarks}
                                                            onChange={(e) => handleChange(index, 'remarks', e.target.value)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>

                                </table>

                                {/* Show submit only if there are DCP items */}
                                {dcp_items.length > 0 && (
                                    <div className="mt-4 text-end">
                                        <Button size="lg" type="submit" disabled={processing} variant="default">
                                            {processing && <Loader2 className="animate-spin mr-2" />}
                                            <span>Submit</span>
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
