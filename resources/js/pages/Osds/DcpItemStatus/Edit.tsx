import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

interface Props {
    dcp_item_status: {
        id: number;
        working: string;
        repairable: string;
        replacement: string;
        unrepairable: string;
        stolen: string | null;
        remarks: string | null;
        dcp_item: {
            id: number;
            description: string;
            quantity: number;
        };
        dcp_recipient: {
            id: number;
            dcp_id: number;
            full_name: string;
        };
    };
}

export default function Edit({ dcp_item_status }: Props) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'DCPs',
            href: '/dcps',
        },
        {
            title: 'DCP Recipients',
            href: `/dcp-recipients/${dcp_item_status.dcp_recipient.dcp_id}`,
        },
        {
            title: 'DCP Item Status',
            href: `/dcp-item-status/${dcp_item_status.dcp_recipient.id}`,
        },
        {
            title: 'Edit DCP Item Status',
            href: '',
        },
    ];

    const { data, setData, patch, processing } = useForm({
        working: dcp_item_status.working || '',
        repairable: dcp_item_status.repairable || '',
        replacement: dcp_item_status.replacement || '',
        unrepairable: dcp_item_status.unrepairable || '',
        stolen: dcp_item_status.stolen || '',
        remarks: dcp_item_status.remarks || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('dcp-item-status.update', dcp_item_status.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit DCP Item Status" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">Edit DCP Item Status</div>
                        <Button>
                            <Link href={`/dcp-item-status/${dcp_item_status.dcp_recipient.id}`}>Back</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
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
                                        <tr>
                                            <td className="border px-3 py-2 text-center">1</td>
                                            <td className="border px-3 py-2">{dcp_item_status.dcp_item.description}</td>
                                            <td className="border px-3 py-2 text-center">{dcp_item_status.dcp_item.quantity}</td>
                                            <td className="border px-3 py-2 text-center">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={data.working}
                                                    onChange={(e) => setData('working', e.target.value)}
                                                    className="w-full border px-2 py-1 text-sm border border-transparent"
                                                />
                                            </td>
                                            <td className="border px-3 py-2 text-center">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={data.repairable}
                                                    onChange={(e) => setData('repairable', e.target.value)}
                                                    className="w-full border px-2 py-1 text-sm border border-transparent"
                                                />
                                            </td>
                                            <td className="border px-3 py-2 text-center">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={data.replacement}
                                                    onChange={(e) => setData('replacement', e.target.value)}
                                                    className="w-full border px-2 py-1 text-sm border border-transparent"
                                                />
                                            </td>
                                            <td className="border px-3 py-2 text-center">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={data.unrepairable}
                                                    onChange={(e) => setData('unrepairable', e.target.value)}
                                                    className="w-full border px-2 py-1 text-sm border border-transparent"
                                                />
                                            </td>
                                            <td className="border px-3 py-2 text-center">
                                                <textarea
                                                    value={data.stolen ?? ''}
                                                    onChange={(e) => setData('stolen', e.target.value)}
                                                    className="w-full text-sm p-1"
                                                />
                                            </td>
                                            <td className="border px-3 py-2 text-center">
                                                <textarea
                                                    value={data.remarks ?? ''}
                                                    onChange={(e) => setData('remarks', e.target.value)}
                                                    className="w-full text-sm p-1"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="text-end mt-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing && <Loader2 className="animate-spin mr-2" />}
                                        Update
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
