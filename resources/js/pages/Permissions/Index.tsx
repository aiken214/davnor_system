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
} from "@/components/ui/alert-dialog"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permissions',
        href: '/permissions',
    },
];

interface LinksType {
    url: string | null;
    label: string;
    active: boolean;
}

interface PermissionType {
    id: number;
    name: string;
}

interface PermissionsType {
    data: PermissionType[];
    links: LinksType[];
    from: number;
    to: number;
    total: number;
}

declare global {
    interface Window {
        Echo: any;
    }
}

export default function PermissionsIndex({ permissions }: { permissions: PermissionsType }) {
    const { flash } = usePage<{ flash: { message?: string } }>().props;

    // Initialize state with full paginated object
    const [allPermissions, setAllPermissions] = useState<PermissionsType>(permissions);

    // Sync local state if the permissions prop changes.
    useEffect(() => {
        setAllPermissions(permissions);
    }, [permissions]);

    useEffect(() => {
        let channel: any;

        if (typeof window !== 'undefined' && window.Echo) {
            channel = window.Echo.channel('permissions').listen(
                'PermissionUpdated',
                ({ permission }: { permission: PermissionType }) => {
                    setAllPermissions((prev) => ({
                        ...prev,
                        data: prev.data.map((p) => (p.id === permission.id ? permission : p)),
                    }));
                },
            );
        }

        if (flash.message) toast.success(flash.message);

        return () => {
            if (channel) channel.stopListening('PermissionUpdated');
            if (window.Echo) window.Echo.leave('permissions');
        };
    }, [flash.message]);

    // Debounced search function
    const handleSearch = useRef(
        debounce((query: string) => {
            router.get('/permissions', { search: query }, { replace: true });
        }, 500),
    ).current;

    function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value;
        handleSearch(query);
    }

    function deletePermission(id: number) {
        router.delete(`/permissions/${id}`);
        toast.success('Permission deleted successfully');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />

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
                            <Link href="/permissions/create" prefetch>
                                Create Permission
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
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allPermissions.data.map((permission, index) => (
                                        <TableRow key={permission.id}>
                                            <TableCell className="w-15">{(allPermissions.from ?? 0) + index}</TableCell>
                                            <TableCell>{permission.name}</TableCell>
                                            <TableCell className="w-50 space-x-1">

                                                <Button asChild size="sm" variant="secondary">
                                                    <Link href={`/permissions/${permission.id}`} prefetch>
                                                        View
                                                    </Link>
                                                </Button>

                                                <Button asChild size="sm" variant="default">
                                                    <Link href={`/permissions/${permission.id}/edit`} 
                                                        preserveState={false}
                                                        preserveScroll={false}
                                                    >
                                                        Edit
                                                    </Link>
                                                </Button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="sm" className="cursor-pointer" variant="destructive">
                                                            Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure you want to delete this permission?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. The permission will be permanently removed.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-600 hover:bg-red-700"
                                                                onClick={() => deletePermission(permission.id)}
                                                            >
                                                                Confirm Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <div className="mb-5 flex items-center justify-between">
                        {allPermissions.total > 0 && (
                            <div className="text-sm text-muted-foreground mt-4">
                                Showing {allPermissions.from} - {allPermissions.to} of {allPermissions.total} permissions
                            </div>
                        )}
                        <InertiaPagination links={allPermissions.links} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
