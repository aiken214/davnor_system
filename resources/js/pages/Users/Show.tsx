import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Show Users',
        href: '/roles',
    },
];

interface UserType {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
}

interface ShowProps {
    user: UserType;
    roles: string[];
}

export default function Show({ user, roles }: ShowProps) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Show Role" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">User Details</div>
                        <Button asChild>
                            <Link href="/users">Back</Link>
                        </Button>
                    </div>

                    <Card >
                        <CardContent className="p-6">                            
                            <div className="space-y-4">
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">ID:</div>
                                    <div className="flex-1 break-words">{user.id}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">user:</div>
                                    <div className="flex-1 break-words">{user.name}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    {/* Label with fixed width */}
                                    <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300 shrink-0">
                                        Role:
                                    </div>

                                    {/* Scrollable tag list */}
                                    <div className="flex-1 overflow-x-auto">
                                        <div className="flex flex-wrap gap-1 whitespace-nowrap">
                                        {roles.map((role, index) => (
                                            <span
                                            key={index}
                                            className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                                            >
                                            {role}
                                            </span>
                                        ))}
                                        </div>
                                    </div>
                                </div>
                                {user.created_at && (
                                    <div className="md:flex md:items-start md:gap-4">
                                        <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Created At:</div>
                                        <div className="flex-1 break-words">{new Date(user.created_at).toLocaleString()}</div>
                                    </div>
                                )}
                                {user.updated_at && (
                                    <div className="md:flex md:items-start md:gap-4">
                                        <div className="md:w-50 font-medium text-gray-700 dark:text-gray-300">Updated At:</div>
                                        <div className="flex-1 break-words">{new Date(user.updated_at).toLocaleString()}</div>
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
