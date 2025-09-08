import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'SBM Indicators',
        href: '/sbm-indicators',
    },
    {
        title: 'View SBM Indicator',
        href: '#',
    },
];

interface SbmIndicatorType {
    id: number;
    description: string;
    area: string;
    created_at?: string;
    updated_at?: string;
}

export default function ShowSbmIndicator({ sbm_indicator }: { sbm_indicator: SbmIndicatorType }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`SbmIndicator: ${sbm_indicator.description}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">SBM Indicator Details</div>
                        <Button asChild>
                            <Link href="/sbm-indicators">Back</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-6">                            
                            <div className="space-y-4">
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">ID:</div>
                                    <div className="flex-1 break-words">{sbm_indicator.id}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Desciption:</div>
                                    <div className="flex-1 break-words">{sbm_indicator.description}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Area of School Operation:</div>
                                    <div className="flex-1 break-words">{sbm_indicator.area}</div>
                                </div>
                                {sbm_indicator.created_at && (
                                    <div className="md:flex md:items-start md:gap-4">
                                        <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Created At:</div>
                                        <div className="flex-1 break-words">{new Date(sbm_indicator.created_at).toLocaleString()}</div>
                                    </div>
                                )}
                                {sbm_indicator.updated_at && (
                                    <div className="md:flex md:items-start md:gap-4">
                                        <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Updated At:</div>
                                        <div className="flex-1 break-words">{new Date(sbm_indicator.updated_at).toLocaleString()}</div>
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
