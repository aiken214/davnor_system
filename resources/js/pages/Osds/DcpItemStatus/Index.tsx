import InertiaPagination from '@/components/inertia-pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
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



interface LinksType {
    url: string | null;
    label: string;
    active: boolean;
}

interface DcpItemStatusType {
    id: number;
    working: number;
    repairable: number;
    replacement: number;
    unrepairable: number;
    stolen: string;
    remarks: string;
    dcp_item_id: number;
    dcp_item?: {
        id: number;
        description: string;
        quantity: number;
    };
}

interface DcpItemStatusesType {
    data: DcpItemStatusType[];
    links: LinksType[];
    from: number;
    to: number;
    total: number;
}

interface DcpRecipientType {
    id: number;
    dcp_id: number;
    school?: {
        id: number;
        name: string;
    };
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

export default function DcpRecipientsIndex({ dcp_item_statuses, dcp_recipient }: { dcp_item_statuses: DcpItemStatusesType; dcp_recipient: DcpRecipientType }) {
    const { flash } = usePage<{ flash: { message?: string } }>().props;
    const [allDcpRecipients, setAllDcpItemStatuses] = useState<DcpItemStatusesType>(dcp_item_statuses);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'DCPs',
            href: '/dcps',
        },
        {
            title: 'DCP Recipients',
            href: `/dcp-recipients/${dcp_recipient.dcp_id}`,
        },
        {
            title: 'DCP Item Status',
            href: '/dcp-item-status',
        },
    ];
    
    useEffect(() => {
        setAllDcpItemStatuses(dcp_item_statuses);
    }, [dcp_item_statuses]);

    useEffect(() => {
        let channel: any;
        if (typeof window !== 'undefined' && window.Echo) {
            channel = window.Echo.channel('dcp_item_statuses').listen(
                'DcpItemStatusUpdated',
                ({ dcp_item_status }: { dcp_item_status: DcpItemStatusType }) => {
                    setAllDcpItemStatuses((prev) => ({
                        ...prev,
                        data: prev.data.map((p) => (p.id === dcp_item_status.id ? dcp_item_status : p)),
                    }));
                },
            );
        }
        if (flash.message) toast.success(flash.message);
        return () => {
            if (channel) channel.stopListening('DcpItemStatusUpdated');
            if (window.Echo) window.Echo.leave('dcp_item_statuses');
        };
    }, [flash.message]);

    const handleSearch = useRef(
        debounce((query: string) => {
            router.get(`/dcp-item-status/index/${dcp_recipient.id}`, { search: query }, { replace: true });
        }, 500),
    ).current;

    function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value;
        handleSearch(query);
    }

    function deleteDcpRecipient(id: number) {
        router.delete(`/dcp-item-status/${id}`);
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
                        <div className="flex gap-1">
                            <Button asChild className="bg-gray-600 hover:bg-gray-700 text-white">
                                <Link href={`/dcp-item-status/create/${dcp_recipient.id}`} prefetch>
                                    Create DCP Item Status
                                </Link>
                            </Button>
                            <Button asChild >
                                <Link href={`/dcp-recipients/${dcp_recipient.dcp_id}`} prefetch>
                                    Back
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-100">
                                        <TableHead rowSpan={3} className="w-[4%] border px-3 py-2 text-center">#</TableHead>
                                        <TableHead rowSpan={3} className="border px-3 py-2 text-center">Items Description</TableHead>
                                        <TableHead rowSpan={3} className="border px-3 py-2 text-center">No. of Item Received</TableHead>
                                        <TableHead colSpan={6} className="border px-3 py-2 text-[16px] text-center">Status</TableHead>
                                        <TableHead rowSpan={3} className="border px-3 py-2 text-center">Action</TableHead>
                                    </TableRow>
                                    <TableRow className="bg-slate-100">
                                        <TableHead rowSpan={2} className="border px-3 py-2 text-center">
                                            Working
                                            <p className="text-[10px]">No. of working units</p>
                                        </TableHead>
                                        <TableHead colSpan={4} className="border px-3 py-2 text-center">Defective</TableHead>
                                        <TableHead rowSpan={2} className="border px-3 py-2 text-center">Remarks</TableHead>
                                    </TableRow>
                                    <TableRow className="bg-slate-100">
                                        <TableHead className="border px-2 py-2 text-center">
                                            For Repair
                                            <p className="text-[10px]">No. of units for repair</p>
                                        </TableHead>
                                        <TableHead className="border px-2 py-2 text-center">
                                            For Replacement
                                            <p className="text-[10px]">No. of units for replacement</p>
                                        </TableHead>
                                        <TableHead className="border px-2 py-2 text-center">
                                            Unrepairable
                                            <p className="text-[10px]">No. of units for replacement</p>
                                        </TableHead>
                                        <TableHead className="border px-2 py-2 text-center">
                                            Stolen
                                            <p className="text-[10px]">If stolen, please state the date<br />reported and other details.</p>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allDcpRecipients.data.map((dcp_item_status, index) => (
                                        <TableRow key={dcp_item_status.id}>
                                            <TableCell className="w-15">{(allDcpRecipients.from ?? 0) + index}</TableCell>
                                            <TableCell className="whitespace-normal break-words">{dcp_item_status.dcp_item?.description}</TableCell>
                                            <TableCell className="text-center">{dcp_item_status.dcp_item?.quantity}</TableCell>
                                            <TableCell className="text-center">{dcp_item_status.working}</TableCell>
                                            <TableCell className="text-center">{dcp_item_status.repairable}</TableCell>
                                            <TableCell className="text-center">{dcp_item_status.replacement}</TableCell>
                                            <TableCell className="text-center">{dcp_item_status.unrepairable}</TableCell>
                                            <TableCell className="whitespace-normal break-words">{dcp_item_status.stolen}</TableCell>
                                            <TableCell className="whitespace-normal break-words">{dcp_item_status.remarks}</TableCell>
                                            <TableCell className="w-50 space-x-1">
                                                <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                                    <Link href={`/dcp-item-status/show/${dcp_item_status.id}`} prefetch>View</Link>
                                                </Button>
                                                <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                                    <Link href={`/dcp-item-status/${dcp_item_status.id}/edit`} preserveState={false} preserveScroll={false}>Edit</Link>
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
                                                            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteDcpRecipient(dcp_item_status.id)}>Confirm Delete</AlertDialogAction>
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
                        {allDcpRecipients.total > 0 && (
                            <div className="text-sm text-muted-foreground mt-4">
                                Showing {allDcpRecipients.from} - {allDcpRecipients.to} of {allDcpRecipients.total} dcp_item_statuses
                            </div>
                        )}
                        <InertiaPagination links={allDcpRecipients.links} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
