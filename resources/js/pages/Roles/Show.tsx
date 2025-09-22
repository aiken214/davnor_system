import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Show Roles',
        href: '/roles',
    },
];

export default function Show({ role, permissions }) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Show Role" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">Role Details</div>
                        <Button asChild>
                            <Link href="/roles">Back</Link>
                        </Button>
                    </div>

                    <Card >
                        <CardContent className="p-6">                            
                            <div className="space-y-4">
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">ID:</div>
                                    <div className="flex-1 break-words">{role.id}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Role:</div>
                                    <div className="flex-1 break-words">{role.name}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    {/* Label with fixed width */}
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300 shrink-0">
                                        Permission:
                                    </div>

                                    {/* Scrollable tag list */}
                                    <div className="flex-1 overflow-x-auto">
                                        <div className="flex flex-wrap gap-1 whitespace-nowrap">
                                        {permissions.map((permission, index) => (
                                            <span
                                            key={index}
                                            className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                                            >
                                            {permission}
                                            </span>
                                        ))}
                                        </div>
                                    </div>
                                </div>
                                {role.created_at && (
                                    <div className="md:flex md:items-start md:gap-4">
                                        <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Created At:</div>
                                        <div className="flex-1 break-words">{new Date(role.created_at).toLocaleString()}</div>
                                    </div>
                                )}
                                {role.updated_at && (
                                    <div className="md:flex md:items-start md:gap-4">
                                        <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Updated At:</div>
                                        <div className="flex-1 break-words">{new Date(role.updated_at).toLocaleString()}</div>
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
