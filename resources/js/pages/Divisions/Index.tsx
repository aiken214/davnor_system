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
        title: 'Divisions',
        href: '/divisions',
    },
];

interface LinksType {
    url: string | null;
    label: string;
    active: boolean;
}

interface DivisionType {
    id: number;
    name: string;
}

interface DivisionsType {
    data: DivisionType[];
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

export default function DivisionsIndex({ divisions }: { divisions: DivisionsType }) {
    const { flash } = usePage<{ flash: { message?: string } }>().props;

    // Initialize state with full paginated object
    const [allDivisions, setAllDivisions] = useState<DivisionsType>(divisions);

    // Sync local state if the divisions prop changes.
    useEffect(() => {
        setAllDivisions(divisions);
    }, [divisions]);

    useEffect(() => {
        let channel: any;

        if (typeof window !== 'undefined' && window.Echo) {
            channel = window.Echo.channel('divisions').listen(
                'DivisionUpdated',
                ({ division }: { division: DivisionType }) => {
                    setAllDivisions((prev) => ({
                        ...prev,
                        data: prev.data.map((p) => (p.id === division.id ? division : p)),
                    }));
                },
            );
        }

        if (flash.message) toast.success(flash.message);

        return () => {
            if (channel) channel.stopListening('DivisionUpdated');
            if (window.Echo) window.Echo.leave('divisions');
        };
    }, [flash.message]);

    // Debounced search function
    const handleSearch = useRef(
        debounce((query: string) => {
            router.get('/divisions', { search: query }, { replace: true });
        }, 500),
    ).current;

    function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value;
        handleSearch(query);
    }

    function deleteDivision(id: number) {
        router.delete(`/divisions/${id}`);
        toast.success('Division deleted successfully');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Divisions" />

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
                            <Link href="/divisions/create" prefetch>
                                Create Division
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
                                    {allDivisions.data.map((division, index) => (
                                        <TableRow key={division.id}>
                                            <TableCell className="w-15">{(allDivisions.from ?? 0) + index}</TableCell>
                                            <TableCell>{division.name}</TableCell>
                                            <TableCell className="w-50 space-x-1">

                                                <Button asChild size="sm" variant="secondary">
                                                    <Link href={`/divisions/${division.id}`} prefetch>
                                                        View
                                                    </Link>
                                                </Button>

                                                <Button asChild size="sm" variant="default">
                                                    <Link href={`/divisions/${division.id}/edit`} 
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
                                                            <AlertDialogTitle>Are you sure you want to delete this division?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. The division will be permanently removed.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-600 hover:bg-red-700"
                                                                onClick={() => deleteDivision(division.id)}
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
                        {allDivisions.total > 0 && (
                            <div className="text-sm text-muted-foreground mt-4">
                                Showing {allDivisions.from} - {allDivisions.to} of {allDivisions.total} divisions
                            </div>
                        )}
                        <InertiaPagination links={allDivisions.links} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
