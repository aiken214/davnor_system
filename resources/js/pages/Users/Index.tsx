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
} from "@/components/ui/alert-dialog";
import { can } from '@/lib/can';
import ImportUsersModal from '@/pages/Users/ImportUsersModal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

interface RoleType {
    id: number;
    name: string;
}

interface UserType {
    id: number;
    name: string;
    email: string;
    roles: RoleType[];
}

interface LinksType {
    url: string | null;
    label: string;
    active: boolean;
}

interface UsersType {
    data: UserType[];
    links: LinksType[];
    from: number;
    to: number;
    total: number;
}

export default function UsersIndex({ users }: { users: UsersType }) {
    const { flash } = usePage<{ flash: { message?: string } }>().props;
    const [allUsers, setAllUsers] = useState<UsersType>(users);

    useEffect(() => {
        setAllUsers(users);
    }, [users]);

    useEffect(() => {
        if (flash.message) toast.success(flash.message);
    }, [flash.message]);

    const handleSearch = useRef(
        debounce((query: string) => {
            router.get('/users', { search: query }, { replace: true });
        }, 500)
    ).current;

    function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value;
        handleSearch(query);
    }

    function deleteUser(id: number) {
        router.delete(route('users.destroy', id));
        toast.success('User deleted successfully.');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
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
                        <div className="flex justify-right gap-1">

                            <ImportUsersModal />

                            {can('user_create') && (
                                <Button asChild>
                                    <Link href="/users/create" prefetch>
                                        Create Users
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Roles</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allUsers?.data?.map((user, index) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{(allUsers.from ?? 0) + index}</TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell className="overflow-x-auto whitespace-nowrap">
                                                {user.roles.map((role) => (
                                                    <span
                                                        key={role.id}
                                                        className="inline-block mr-1 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                                                    >
                                                        {role.name}
                                                    </span>
                                                ))}
                                            </TableCell>
                                            <TableCell className="w-[200px] space-x-1">
                                                <Button asChild size="sm" variant="secondary">
                                                    <Link href={route('users.show', user.id)} prefetch>
                                                        View
                                                    </Link>
                                                </Button>

                                                {can('user_edit') && (
                                                    <Button asChild size="sm" variant="default">
                                                        <Link href={route('users.edit', user.id)} preserveState={false} preserveScroll={false}>
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                )}

                                                {can('user_delete') && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="sm" className="cursor-pointer" variant="destructive">
                                                                Delete
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. The user will be permanently deleted.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                    onClick={() => deleteUser(user.id)}
                                                                >
                                                                    Confirm Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <div className="mb-5 flex items-center justify-between">
                        {allUsers.total > 0 && (
                            <div className="text-sm text-muted-foreground mt-4">
                                Showing {allUsers.from} - {allUsers.to} of {allUsers.total} users
                            </div>
                        )}
                        <InertiaPagination links={allUsers.links} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
