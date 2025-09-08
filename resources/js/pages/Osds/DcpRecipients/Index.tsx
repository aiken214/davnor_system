import InertiaPagination from '@/components/inertia-pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
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
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from '@/components/ui/dialog';
import { can } from '@/lib/can';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'DCPs',
        href: '/dcps',
    },
    {
        title: 'DCP Recipients',
        href: '/dcp-recipients',
    },
];

interface LinksType {
    url: string | null;
    label: string;
    active: boolean;
}

interface DcpRecipientType {
    id: number;
    allocation: number;
    date_delivery: string;
    file: string;
    remarks: string;
    school?: {
        id: number;
        name: string;
    };
}

interface DcpRecipientsType {
    data: DcpRecipientType[];
    links: LinksType[];
    from: number;
    to: number;
    total: number;
}

interface DcpType {
    id: number;
    description: string;
}

interface PdfModalProps {
    file: string;
}

declare global {
    interface Window {
        Echo: any;
    }
}

function PdfModal({ file }: PdfModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div className="text-left">
                <DialogTrigger asChild>
                    <Button variant="link" className="text-blue-600 underline p-0 h-auto cursor-pointer">
                        View File
                    </Button>
                </DialogTrigger>
            </div>

            <DialogContent className="!max-w-[80vw] !w-[80vw] !h-[90vh] !p-0 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-white">
                    <h2 className="text-base font-semibold">PDF Preview</h2>
                    <DialogClose asChild>
                        <button className="text-gray-600 hover:text-black p-1 rounded-md transition" aria-label="Close">
                            <X className="h-5 w-5" />
                        </button>
                    </DialogClose>
                </div>
                <iframe src={`/storage/${file}`} title="PDF File" className="flex-1 w-full h-full" />
            </DialogContent>
        </Dialog>
    );
}

export default function DcpRecipientsIndex({ dcp_recipients, dcp }: { dcp_recipients: DcpRecipientsType; dcp: DcpType }) {
    const { flash } = usePage<{ flash: { message?: string } }>().props;
    const [allDcpRecipients, setAllDcpRecipients] = useState<DcpRecipientsType>(dcp_recipients);

    useEffect(() => {
        setAllDcpRecipients(dcp_recipients);
    }, [dcp_recipients]);

    useEffect(() => {
        let channel: any;
        if (typeof window !== 'undefined' && window.Echo) {
            channel = window.Echo.channel('dcp_recipients').listen(
                'DcpRecipientUpdated',
                ({ dcp_recipient }: { dcp_recipient: DcpRecipientType }) => {
                    setAllDcpRecipients((prev) => ({
                        ...prev,
                        data: prev.data.map((p) => (p.id === dcp_recipient.id ? dcp_recipient : p)),
                    }));
                },
            );
        }
        if (flash.message) toast.success(flash.message);
        return () => {
            if (channel) channel.stopListening('DcpRecipientUpdated');
            if (window.Echo) window.Echo.leave('dcp_recipients');
        };
    }, [flash.message]);

    const handleSearch = useRef(
        debounce((query: string) => {
            router.get(`/dcp-recipients/index/${dcp.id}`, { search: query }, { replace: true });
        }, 500),
    ).current;

    function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value;
        handleSearch(query);
    }

    function deleteDcpRecipient(id: number) {
        router.delete(`/dcp-recipients/${id}`);
        toast.success('DCP recipient deleted successfully');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="DepEd Computerization Program (DCP)" />
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
                            <Link href={`/dcp-recipients/create/${dcp.id}`} prefetch>
                                Create DCP Recipient
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>School</TableHead>
                                        <TableHead>No. of Package Received</TableHead>
                                        <TableHead>Date of Delivery</TableHead>
                                        <TableHead>File</TableHead>
                                        <TableHead>Remarks</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allDcpRecipients.data.map((dcp_recipient, index) => (
                                        <TableRow key={dcp_recipient.id}>
                                            <TableCell className="w-15">{(allDcpRecipients.from ?? 0) + index}</TableCell>
                                            <TableCell>{dcp_recipient.school?.name}</TableCell>
                                            <TableCell>{dcp_recipient.allocation}</TableCell>
                                            <TableCell>{dcp_recipient.date_delivery}</TableCell>
                                            <TableCell>{dcp_recipient.file ? <PdfModal file={dcp_recipient.file} /> : <span className="text-gray-400 italic">No file</span>}</TableCell>
                                            <TableCell>{dcp_recipient.remarks}</TableCell>
                                            <TableCell className="w-50 space-x-1">
                                                <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                                    <Link href={`/dcp-recipients/show/${dcp_recipient.id}`} prefetch>View</Link>
                                                </Button>
                                                <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                                    <Link href={`/dcp-recipients/${dcp_recipient.id}/edit`} preserveState={false} preserveScroll={false}>Edit</Link>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="sm" className="cursor-pointer bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure you want to delete this DCP?</AlertDialogTitle>
                                                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteDcpRecipient(dcp_recipient.id)}>Confirm Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                                <Button asChild size="sm" className="bg-slate-600 hover:bg-slate-700 text-white">
                                                    <Link href={`/dcp-item-status/${dcp_recipient.id}`} preserveState={false} preserveScroll={false}>Status</Link>
                                                </Button>       
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <div className="mb-5 flex items-center justify-between">
                        {allDcpRecipients.total > 0 && (
                            <div className="text-sm text-muted-foreground mt-4">
                                Showing {allDcpRecipients.from} - {allDcpRecipients.to} of {allDcpRecipients.total} dcp_recipients
                            </div>
                        )}
                        <InertiaPagination links={allDcpRecipients.links} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
