import InertiaPagination from '@/components/inertia-pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
import { can } from '@/lib/can';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'ICT Helpdesk Tickets',
        href: '/tickets',
    },
];

interface LinksType {
    url: string | null;
    label: string;
    active: boolean;
}

interface TicketType {
    ticket: number;
    id: number;
    category_id: number;
    subject: string;
    description: string;
    priority: string;
    status: string;
    assigned_to: string;
    resolved_at: string;
    user?: {
        id: number;
        name: string;
    };
    category?: {
        id: number;
        name: string;
    }

}

interface TicketsType {
    data: TicketType[];
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

export default function TicketsIndex({ tickets }: { tickets: TicketsType }) {
    const { flash } = usePage<{ flash: { message?: string } }>().props;
    const [alltickets, setAlltickets] = useState<TicketsType>(tickets);

    useEffect(() => {
        setAlltickets(tickets);
    }, [tickets]);

    useEffect(() => {
        let channel: any;
        if (typeof window !== 'undefined' && window.Echo) {
            channel = window.Echo.channel('tickets').listen(
                'ticketUpdated',
                ({ ticket }: { ticket: TicketType }) => {
                    setAlltickets((prev) => ({
                        ...prev,
                        data: prev.data.map((p) => (p.id === ticket.id ? ticket : p)),
                    }));
                },
            );
        }
        if (flash.message) toast.success(flash.message);
        return () => {
            if (channel) channel.stopListening('ticketUpdated');
            if (window.Echo) window.Echo.leave('tickets');
        };
    }, [flash.message]);

    const handleSearch = useRef(
        debounce((query: string) => {
            router.get('/tickets', { search: query }, { replace: true });
        }, 500),
    ).current;

    function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value;
        handleSearch(query);
    }

    function deleteticket(id: number) {
        router.delete(`/tickets/${id}`);
        toast.success('ticket batch deleted successfully');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="ICT Helpdesk Ticket" />
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

                        <div className="flex gap-1">
                            {can('ticket_category_access') && (
                                <Button asChild className="bg-gray-600 hover:bg-gray-700 text-white">
                                    <Link href="/ticket-categories" prefetch>
                                        Ticket Category
                                    </Link>
                                </Button>
                            )}
                            <Button asChild>
                                <Link href="/tickets/create" prefetch>
                                    Create Helpdesk Ticket
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>User Name</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Assigned To</TableHead>
                                        <TableHead>Resolved At</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {alltickets.data.map((ticket, index) => (
                                        <TableRow key={ticket.id}>
                                            <TableCell className="w-15">{(alltickets.from ?? 0) + index}</TableCell>
                                            <TableCell>{ticket.category?.name}</TableCell>
                                            <TableCell>{ticket.subject}</TableCell>
                                            <TableCell>{ticket.description}</TableCell>
                                            <TableCell>{ticket.user?.name}</TableCell>
                                            <TableCell>
                                                {ticket.priority == 'low' && <Badge className="bg-green-500">Low</Badge>}
                                                {ticket.priority == 'medium' && <Badge className="bg-blue-500">Medium</Badge>}
                                                {ticket.priority == 'high' && <Badge className="bg-orange-600">High</Badge>}
                                                {ticket.priority == 'urgent' && <Badge className="bg-red-600">Urgent</Badge>}
                                            </TableCell>
                                            <TableCell>
                                                {ticket.status == 'open' && <Badge className="bg-blue-500">Open</Badge>}
                                                {ticket.status == 'in_progress' && <Badge className="bg-green-500">In Progress</Badge>}
                                                {ticket.status == 'resolved' && <Badge className="bg-sky-600">Disapproved</Badge>}
                                                {ticket.status == 'closed' && <Badge className="bg-red-600">Disapproved</Badge>}
                                            </TableCell>
                                            <TableCell>{ticket.assigned_to}</TableCell>
                                            <TableCell>{ticket.resolved_at}</TableCell>
                                            <TableCell className="w-50 space-x-1">
                                                <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                                    <Link href={`/tickets/${ticket.id}`} prefetch>View</Link>
                                                </Button>
                                                <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                                    <Link href={`/tickets/${ticket.id}/edit`} preserveState={false} preserveScroll={false}>Edit</Link>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="sm" className="cursor-pointer bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure you want to delete this ticket?</AlertDialogTitle>
                                                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteticket(ticket.id)}>Confirm Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                                {/* <Button asChild size="sm" className="bg-slate-600 hover:bg-slate-700 text-white">
                                                    <Link href={`/ticket-items/${ticket.id}`} preserveState={false} preserveScroll={false}>Items</Link>
                                                </Button>                                                
                                                <Button asChild size="sm">
                                                    <Link href={`/ticket-recipients/${ticket.id}`} preserveState={false} preserveScroll={false}>Recipients</Link>
                                                </Button> */}

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <div className="mb-5 flex items-center justify-between">
                        {alltickets.total > 0 && (
                            <div className="text-sm text-muted-foreground mt-4">
                                Showing {alltickets.from} - {alltickets.to} of {alltickets.total} tickets
                            </div>
                        )}
                        <InertiaPagination links={alltickets.links} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
