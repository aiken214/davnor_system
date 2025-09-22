import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TicketCategoryType {
    id: number;
    name: string;
    description: string;
    office?: {
        id: number;
        name: string;
    }
    created_at?: string;
    updated_at?: string;
}

export default function ShowDcpItems({ ticketCategory }: { ticketCategory: TicketCategoryType }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Ticket Categories', href: '/ticket-categories' },
        { title: 'Show Ticket Categories', href: '#' },
    ];
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Show Ticket Category" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">Ticket Category Details</div>
                        <Button asChild>
                            <Link href= '/ticket-categories'>Back</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">ID:</div>
                                    <div className="flex-1 break-words">{ticketCategory.id}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Name:</div>
                                    <div className="flex-1 break-words">{ticketCategory.name}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Description:</div>
                                    <div className="flex-1 break-words">{ticketCategory.description}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Responsible Office:</div>
                                    <div className="flex-1 break-words">{ticketCategory.office?.name}</div>
                                </div>
                                {ticketCategory.created_at && (
                                    <div className="md:flex md:items-start md:gap-4">
                                        <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Created At:</div>
                                        <div className="flex-1 break-words">{new Date(ticketCategory.created_at).toLocaleString()}</div>
                                    </div>
                                )}
                                {ticketCategory.updated_at && (
                                    <div className="md:flex md:items-start md:gap-4">
                                        <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Updated At:</div>
                                        <div className="flex-1 break-words">{new Date(ticketCategory.updated_at).toLocaleString()}</div>
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
