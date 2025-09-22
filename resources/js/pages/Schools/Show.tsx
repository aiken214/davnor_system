import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Schools',
        href: '/schools',
    },
    {
        title: 'View School',
        href: '#',
    },
];

interface SchoolType {
    id: number;
    name: string;
    district?: {
        id: number;
        name: string;
        division?: {
            id: number;
            name: string;        
        };        
    };
    
    created_at?: string;
    updated_at?: string;
}

export default function ShowSchool({ school }: { school: SchoolType }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`School: ${school.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">School Details</div>
                        <Button asChild>
                            <Link href="/schools">Back</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">ID:</div>
                                    <div className="flex-1 break-words">{school.id}</div>
                                </div>

                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Name:</div>
                                    <div className="flex-1 break-words">{school.name}</div>
                                </div>

                                {school.district && (
                                    <div className="md:flex md:items-start md:gap-4">
                                        <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">District:</div>
                                        <div className="flex-1 break-words">{school.district.name}</div>
                                    </div>
                                )}
                                {school.district && school.district.division && (
                                    <div className="md:flex md:items-start md:gap-4">
                                        <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Division:</div>
                                        <div className="flex-1 break-words">{school.district.division.name}</div>
                                    </div>
                                )}

                                {school.created_at && (
                                    <div className="md:flex md:items-start md:gap-4">
                                        <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Created At:</div>
                                        <div className="flex-1 break-words">
                                            {new Date(school.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                )}

                                {school.updated_at && (
                                    <div className="md:flex md:items-start md:gap-4">
                                        <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Updated At:</div>
                                        <div className="flex-1 break-words">
                                            {new Date(school.updated_at).toLocaleString()}
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
