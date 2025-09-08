import InertiaPagination from '@/components/inertia-pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import debounce from 'lodash/debounce';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { can } from '@/lib/can';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

interface LinksType {
    url: string | null;
    label: string;
    active: boolean;
}

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

interface RolesType {
    data: Role[];
    links: LinksType[];
    from: number;
    to: number;
    total: number;
}

export default function RolesIndex({ roles }: { roles: RolesType }) {
    const { flash } = usePage<{ flash: { message?: string } }>().props;

    const [allRoles, setAllRoles] = useState<RolesType>(
        roles ?? { data: [], links: [], from: 0, to: 0, total: 0 }
    );

    useEffect(() => {
        setAllRoles(roles);
    }, [roles]);

    useEffect(() => {
        if (flash.message) toast.success(flash.message);
    }, [flash.message]);

    const handleSearch = useRef(
        debounce((query: string) => {
            router.get('/roles', { search: query }, { replace: true });
        }, 500)
    ).current;

    function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value;
        handleSearch(query);
    }

    function deleteRole(id: number) {
        router.delete(`/roles/${id}`);
        toast.success('Role deleted successfully');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="relative w-full sm:w-1/4">
                            <Input
                                id="search"
                                className="peer ps-9"
                                placeholder="Search..."
                                type="search"
                                onChange={onSearchChange}
                            />
                            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                                <Search size={16} aria-hidden="true" />
                            </div>
                        </div>

                        <Button asChild>
                            <Link href="/roles/create" prefetch>
                                Create Role
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Permissions</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allRoles?.data?.map((role, index) => (
                                        <TableRow key={role.id}>
                                            <TableCell className="w-15">{(allRoles.from ?? 0) + index}</TableCell>
                                            <TableCell className="w-30">{role.name}</TableCell>
                                            <TableCell className="space-x-1">
                                                <div className="flex flex-wrap gap-1 overflow-x-auto whitespace-nowrap">
                                                    {role.permissions.map((perm) => (
                                                        <span
                                                            key={perm.id}
                                                            className="inline-block mb-1 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                                                        >
                                                            {perm.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="space-x-1">
                                                {can('user_show') && (<Button asChild size="sm" variant="secondary">
                                                    <Link href={`/roles/${role.id}`} prefetch>
                                                        View
                                                    </Link>
                                                </Button>)}
                                                {can('user_edit') && (<Button asChild size="sm" variant="default">
                                                    <Link href={`/roles/${role.id}/edit`} preserveState={false} preserveScroll={false}>
                                                        Edit
                                                    </Link>
                                                </Button>)}
                                                {can('user_delete') && (<AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="sm" className="cursor-pointer" variant="destructive">
                                                            Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Are you sure you want to delete this role?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. The role will be permanently removed.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-600 hover:bg-red-700"
                                                                onClick={() => deleteRole(role.id)}
                                                            >
                                                                Confirm Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <div className="mb-5 flex items-center justify-between">
                        {allRoles.total > 0 && (
                            <div className="text-sm text-muted-foreground mt-4">
                                Showing {allRoles.from} - {allRoles.to} of {allRoles.total} roles
                            </div>
                        )}
                        <InertiaPagination links={allRoles.links} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
