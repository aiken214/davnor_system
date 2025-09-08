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
        title: 'Schools',
        href: '/schools',
    },
];

interface LinksType {
    url: string | null;
    label: string;
    active: boolean;
}

interface SchoolType {
    id: number;
    name: string;
    depedsch_id: number;
    address: string;
    contact_number: number;
    email: string;
    district?: {
        id: number;
        name: string;
        division_id: number;
        division?: {
            id: number;
            name: string;
        };
    };
}

interface SchoolsType {
    data: SchoolType[];
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

export default function SchoolsIndex({ schools, districts }: { schools: SchoolsType, districts: { id: number; name: string }[] }) {
    const { flash } = usePage<{ flash: { message?: string } }>().props;

    // Initialize state with full paginated object
    const [allSchools, setAllSchools] = useState<SchoolsType>(schools);

    // Sync local state if the districts prop changes.
    useEffect(() => {
        setAllSchools(schools);
    }, [schools]);

    useEffect(() => {
        let channel: any;

        if (typeof window !== 'undefined' && window.Echo) {
            channel = window.Echo.channel('schools').listen(
                'SchoolUpdated',
                ({ school }: { school: SchoolType }) => {
                    setAllSchools((prev) => ({
                        ...prev,
                        data: prev.data.map((p) => (p.id === school.id ? school : p)),
                    }));
                },
            );
        }

        if (flash.message) toast.success(flash.message);

        return () => {
            if (channel) channel.stopListening('SchoolUpdated');
            if (window.Echo) window.Echo.leave('schools');
        };
    }, [flash.message]);

    // Debounced search function
    const handleSearch = useRef(
        debounce((query: string) => {
            router.get('/schools', { search: query }, { replace: true });
        }, 500),
    ).current;

    function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value;
        handleSearch(query);
    }

    function deleteDistrict(id: number) {
        router.delete(`/schools/${id}`);
        toast.success('School deleted successfully');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schools" />

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
                            <Link href="/schools/create" prefetch>
                                Create School
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>School ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Division</TableHead>
                                        <TableHead>District</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead>Contact No.</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allSchools.data.map((school, index) => (
                                        <TableRow key={school.id}>
                                            <TableCell className="w-15">{(allSchools.from ?? 0) + index}</TableCell>
                                            <TableCell>{school.depedsch_id}</TableCell>
                                            <TableCell>{school.name}</TableCell>
                                            <TableCell>{school.district?.division?.name ?? '—'}</TableCell>
                                            <TableCell>{school.district?.name}</TableCell>
                                            <TableCell>{school.address}</TableCell>
                                            <TableCell>{school.contact_number}</TableCell>
                                            <TableCell>{school.email}</TableCell>
                                            <TableCell className="w-50 space-x-1">

                                                <Button asChild size="sm" variant="secondary">
                                                    <Link href={`/schools/${school.id}`} prefetch>
                                                        View
                                                    </Link>
                                                </Button>

                                                <Button asChild size="sm" variant="default">
                                                    <Link href={`/schools/${school.id}/edit`} 
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
                                                            <AlertDialogTitle>Are you sure you want to delete this district?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. The district will be permanently removed.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-600 hover:bg-red-700"
                                                                onClick={() => deleteDistrict(school.id)}
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
                        {allSchools.total > 0 && (
                            <div className="text-sm text-muted-foreground mt-4">
                                Showing {allSchools.from} - {allSchools.to} of {allSchools.total} schools
                            </div>
                        )}
                        <InertiaPagination links={allSchools.links} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
