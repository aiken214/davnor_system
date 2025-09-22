import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Districts',
        href: '/districts',
    },
    {
        title: 'View District',
        href: '#',
    },
];

interface DistrictType {
    id: number;
    name: string;
    division?: {
        id: number;
        name: string;
    };
    created_at?: string;
    updated_at?: string;
}

export default function ShowDistrict({ district }: { district: DistrictType }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`District: ${district.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">District Details</div>
                        <Button asChild>
                            <Link href="/districts">Back</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">ID:</div>
                                    <div className="flex-1 break-words">{district.id}</div>
                                </div>

                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Name:</div>
                                    <div className="flex-1 break-words">{district.name}</div>
                                </div>

                                {district.division && (
                                    <div className="md:flex md:items-start md:gap-4">
                                        <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Division:</div>
                                        <div className="flex-1 break-words">{district.division.name}</div>
                                    </div>
                                )}

                                {district.created_at && (
                                    <div className="md:flex md:items-start md:gap-4">
                                        <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Created At:</div>
                                        <div className="flex-1 break-words">
                                            {new Date(district.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                )}

                                {district.updated_at && (
                                    <div className="md:flex md:items-start md:gap-4">
                                        <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Updated At:</div>
                                        <div className="flex-1 break-words">
                                            {new Date(district.updated_at).toLocaleString()}
                                        </div>
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
