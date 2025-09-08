import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DcpItemType {
    id: number;
    description: string;
    quantity: string;
    dcp_id: number;
    created_at?: string;
    updated_at?: string;
}

export default function ShowDcpItems({ dcp_item }: { dcp_item: DcpItemType }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'DCPs',
            href: '/dcps',
        },
        {
            title: 'DCP Items',
            href: `/dcp-items/${dcp_item.dcp_id}`,
        },
        {
            title: 'View DCP Item',
            href: '#',
        },
    ];
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`DcpItem: ${dcp_item.description}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">DCP Item Details</div>
                        <Button asChild>
                            <Link href={`/dcp-items/${dcp_item.dcp_id}`}>Back</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">ID:</div>
                                    <div className="flex-1 break-words">{dcp_item.id}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Desciption:</div>
                                    <div className="flex-1 break-words">{dcp_item.description}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Area of School Operation:</div>
                                    <div className="flex-1 break-words">{dcp_item.quantity}</div>
                                </div>
                                {dcp_item.created_at && (
                                    <div className="md:flex md:items-start md:gap-4">
                                        <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Created At:</div>
                                        <div className="flex-1 break-words">{new Date(dcp_item.created_at).toLocaleString()}</div>
                                    </div>
                                )}
                                {dcp_item.updated_at && (
                                    <div className="md:flex md:items-start md:gap-4">
                                        <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Updated At:</div>
                                        <div className="flex-1 break-words">{new Date(dcp_item.updated_at).toLocaleString()}</div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
