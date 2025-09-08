import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useState } from 'react';

interface DcpItemStatusType {
    id: number;
    working: number;
    repairable: number;
    replacement: number;
    unrepairable: number;
    stolen: string;
    remarks: string;
    dcp_recipient_id: number;
    dcp_item?: {
        id: number;
        description: string;
        quantity: number;
    };
    dcp_recipient?: {
        id: number;
        dcp_id: number;
        school?: {
            id: number;
            name: string;
        };
    };
    created_at?: string;
    updated_at?: string;
}

export default function ShowDcpItemStatus({
    dcp_item_status,
}: {
    dcp_item_status: DcpItemStatusType;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'DCPs',
            href: '/dcps',
        },
        {
            title: 'DCP Recipients',
            href: `/dcp-recipients/${dcp_item_status.dcp_recipient?.dcp_id}`,
        },
        {
            title: 'DCP Item Status',
            href: `/dcp-item-status/${dcp_item_status.dcp_recipient_id}`,
        },
        {
            title: 'View DCP Item Status',
            href: '',
        },
    ];

    const dcp_recipient = dcp_item_status.dcp_recipient;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`DCP Recipient: ${dcp_recipient?.school?.name ?? ''}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">DCP Item Status Details</div>
                        <Button asChild>
                            <Link href={`/dcp-item-status/${dcp_item_status.dcp_recipient_id}`}>Back</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">ID:</div>
                                    <div className="flex-1 break-words">{dcp_item_status.id}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">No. of Items Received:</div>
                                    <div className="flex-1 break-words">{dcp_item_status.dcp_item?.quantity}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Working:</div>
                                    <div className="flex-1 break-words">{dcp_item_status.working}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Repairable:</div>
                                    <div className="flex-1 break-words">{dcp_item_status.repairable}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Replacement:</div>
                                    <div className="flex-1 break-words">{dcp_item_status.replacement}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Unrepairable:</div>
                                    <div className="flex-1 break-words">{dcp_item_status.unrepairable}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Stolen:</div>
                                    <div className="flex-1 break-words">{dcp_item_status.stolen}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Remarks:</div>
                                    <div className="flex-1 break-words">{dcp_item_status.remarks}</div>
                                </div>
                                {dcp_item_status.created_at && (
                                    <div className="md:flex md:items-start md:gap-4">
                                        <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Created At:</div>
                                        <div className="flex-1 break-words">{new Date(dcp_item_status.created_at).toLocaleString()}</div>
                                    </div>
                                )}
                                {dcp_item_status.updated_at && (
                                    <div className="md:flex md:items-start md:gap-4">
                                        <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Updated At:</div>
                                        <div className="flex-1 break-words">{new Date(dcp_item_status.updated_at).toLocaleString()}</div>
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