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
        title: 'Ticket Categories',
        href: '#',
    },
];

interface LinksType {
    url: string | null;
    label: string;
    active: boolean;
}

interface TicketCategoryType {
    id: number;
    name: string;
    description: number;
    office?: {
        id: number;
        name: string;
    }
}

interface TicketCategoriesType {
    data: TicketCategoryType[];
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

export default function Index({ ticket_categories }: { ticket_categories: TicketCategoriesType }) {
    const { flash } = usePage<{ flash: { message?: string } }>().props;

    const [allTicketCategories, setAllTicketCategories] = useState<TicketCategoriesType>(ticket_categories);

    useEffect(() => {
        setAllTicketCategories(ticket_categories);
    }, [ticket_categories]);

    useEffect(() => {
        let channel: any;

        if (typeof window !== 'undefined' && window.Echo) {
            channel = window.Echo.channel('ticket_categories').listen(
                'TicketCategoryUpdated',
                ({ ticket_category }: { ticket_category: TicketCategoryType }) => {
                    setAllTicketCategories((prev) => ({
                        ...prev,
                        data: prev.data.map((p) => (p.id === ticket_category.id ? ticket_category : p)),
                    }));
                },
            );
        }

        if (flash.message) toast.success(flash.message);

        return () => {
            if (channel) channel.stopListening('TicketCategoryUpdated');
            if (window.Echo) window.Echo.leave('ticket_categories');
        };
    }, [flash.message]);

    const handleSearch = useRef(
        debounce((query: string) => {
            router.get(`/ticket-categories`, { search: query }, { replace: true });
        }, 500),
    ).current;

    function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value;
        handleSearch(query);
    }

    function deleteTicketCategory(id: number) {
        router.delete(`/ticket-categories/${id}`);
        toast.success('Ticket category deleted successfully');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ticket Categories" />

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
                            <Link href={`/ticket-categories/create/`} prefetch>
                                Create Ticket Category
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
                                        <TableHead>Description</TableHead>
                                        <TableHead>Responsible Office</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allTicketCategories.data.map((ticket_category, index) => (
                                        <TableRow key={ticket_category.id}>
                                            <TableCell className="w-15">{(allTicketCategories.from ?? 0) + index}</TableCell>
                                            <TableCell>{ticket_category.name}</TableCell>
                                            <TableCell>{ticket_category.description}</TableCell>
                                            <TableCell>{ticket_category.office?.name}</TableCell>
                                            <TableCell className="w-50 space-x-1">
                                                <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                                    <Link href={`/ticket-categories/${ticket_category.id}`} prefetch>View</Link>
                                                </Button>
                                                <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                                    <Link href={`/ticket-categories/${ticket_category.id}/edit`} preserveState={false} preserveScroll={false}>
                                                        Edit
                                                    </Link>
                                                </Button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="sm" className="cursor-pointer bg-red-600 hover:bg-red-700 text-white">
                                                            Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure you want to delete this Ticket Category?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. The Ticket Category will be permanently removed.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-600 hover:bg-red-700"
                                                                onClick={() => deleteTicketCategory(ticket_category.id)}
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
                        {allTicketCategories.total > 0 && (
                            <div className="text-sm text-muted-foreground mt-4">
                                Showing {allTicketCategories.from} - {allTicketCategories.to} of {allTicketCategories.total} ticket_categories
                            </div>
                        )}
                        <InertiaPagination links={allTicketCategories.links} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
