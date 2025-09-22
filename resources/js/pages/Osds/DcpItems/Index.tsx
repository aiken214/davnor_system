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
        title: 'DCPs',
        href: '/dcps',
    },
    {
        title: 'DCP Items',
        href: '/dcp-items',
    },
];

interface LinksType {
    url: string | null;
    label: string;
    active: boolean;
}

interface DcpItemType {
    dcp: number;
    id: number;
    description: string;
    quantity: number;
}

interface DcpItemsType {
    data: DcpItemType[];
    links: LinksType[];
    from: number;
    to: number;
    total: number;
}

interface DcpType {
    id: number;
    description: string;
}

declare global {
    interface Window {
        Echo: any;
    }
}

export default function Index({ dcp_items, dcp }: { dcp_items: DcpItemsType; dcp: DcpType }) {
    const { flash } = usePage<{ flash: { message?: string } }>().props;

    const [allDcpItems, setAllDcpItems] = useState<DcpItemsType>(dcp_items);

    useEffect(() => {
        setAllDcpItems(dcp_items);
    }, [dcp_items]);

    useEffect(() => {
        let channel: any;

        if (typeof window !== 'undefined' && window.Echo) {
            channel = window.Echo.channel('dcp_items').listen(
                'DcpItemUpdated',
                ({ dcp_item }: { dcp_item: DcpItemType }) => {
                    setAllDcpItems((prev) => ({
                        ...prev,
                        data: prev.data.map((p) => (p.id === dcp_item.id ? dcp_item : p)),
                    }));
                },
            );
        }

        if (flash.message) toast.success(flash.message);

        return () => {
            if (channel) channel.stopListening('DcpItemUpdated');
            if (window.Echo) window.Echo.leave('dcp_items');
        };
    }, [flash.message]);

    const handleSearch = useRef(
        debounce((query: string) => {
            router.get(`/dcp-items/index/${dcp.id}`, { search: query }, { replace: true });
        }, 500),
    ).current;

    function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value;
        handleSearch(query);
    }

    function deleteDcpItem(id: number) {
        router.delete(`/dcp-items/${id}`);
        toast.success('DCP Item deleted successfully');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="DCP Items" />

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
                            <Link href={`/dcp-items/create/${dcp.id}`} prefetch>
                                Create DCP Item
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allDcpItems.data.map((dcp_item, index) => (
                                        <TableRow key={dcp_item.id}>
                                            <TableCell className="w-15">{(allDcpItems.from ?? 0) + index}</TableCell>
                                            <TableCell>{dcp_item.description}</TableCell>
                                            <TableCell>{dcp_item.quantity}</TableCell>
                                            <TableCell className="w-50 space-x-1">
                                                <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                                    <Link href={`/dcp-items/show/${dcp_item.id}`} prefetch>View</Link>
                                                </Button>
                                                <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                                    <Link href={`/dcp-items/${dcp_item.id}/edit`} preserveState={false} preserveScroll={false}>
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
                                                            <AlertDialogTitle>Are you sure you want to delete this DCP Item?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. The DCP Item will be permanently removed.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-600 hover:bg-red-700"
                                                                onClick={() => deleteDcpItem(dcp_item.id)}
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
                        {allDcpItems.total > 0 && (
                            <div className="text-sm text-muted-foreground mt-4">
                                Showing {allDcpItems.from} - {allDcpItems.to} of {allDcpItems.total} dcp_items
                            </div>
                        )}
                        <InertiaPagination links={allDcpItems.links} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
