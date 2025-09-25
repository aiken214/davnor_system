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
];

interface LinksType {
    url: string | null;
    label: string;
    active: boolean;
}

interface DcpType {
    id: number;
    batch: string;
    year: string;
    configuration: string;
    supplier: string;
    file: string;
    remarks: string;
}

interface DcpsType {
    data: DcpType[];
    links: LinksType[];
    from: number;
    to: number;
    total: number;
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

export default function DcpsIndex({ dcps }: { dcps: DcpsType }) {
    const { flash } = usePage<{ flash: { message?: string } }>().props;
    const [allDcps, setAllDcps] = useState<DcpsType>(dcps);

    useEffect(() => {
        setAllDcps(dcps);
    }, [dcps]);

    useEffect(() => {
        let channel: any;
        if (typeof window !== 'undefined' && window.Echo) {
            channel = window.Echo.channel('dcps').listen(
                'DcpUpdated',
                ({ dcp }: { dcp: DcpType }) => {
                    setAllDcps((prev) => ({
                        ...prev,
                        data: prev.data.map((p) => (p.id === dcp.id ? dcp : p)),
                    }));
                },
            );
        }
        if (flash.message) toast.success(flash.message);
        return () => {
            if (channel) channel.stopListening('DcpUpdated');
            if (window.Echo) window.Echo.leave('dcps');
        };
    }, [flash.message]);

    const handleSearch = useRef(
        debounce((query: string) => {
            router.get('/dcps', { search: query }, { replace: true });
        }, 500),
    ).current;

    function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value;
        handleSearch(query);
    }

    function deleteDcp(id: number) {
        router.delete(`/dcps/${id}`);
        toast.success('DCP batch deleted successfully');
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
                            <Link href="/dcps/create" prefetch>
                                Create DCP 
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Batch</TableHead>
                                        <TableHead>Year</TableHead>
                                        <TableHead>Configuration</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>File</TableHead>
                                        <TableHead>Remarks</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allDcps.data.map((dcp, index) => (
                                        <TableRow key={dcp.id}>
                                            <TableCell className="w-15">{(allDcps.from ?? 0) + index}</TableCell>
                                            <TableCell>{dcp.batch}</TableCell>
                                            <TableCell>{dcp.year}</TableCell>
                                            <TableCell>{dcp.configuration}</TableCell>
                                            <TableCell>{dcp.supplier}</TableCell>
                                            <TableCell>{dcp.file ? <PdfModal file={dcp.file} /> : <span className="text-gray-400 italic">No file</span>}</TableCell>
                                            <TableCell>{dcp.remarks}</TableCell>
                                            <TableCell className="w-50 space-x-1">
                                                <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                                    <Link href={`/dcps/${dcp.id}`} prefetch>View</Link>
                                                </Button>
                                                <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                                    <Link href={`/dcps/${dcp.id}/edit`} preserveState={false} preserveScroll={false}>Edit</Link>
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
                                                            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteDcp(dcp.id)}>Confirm Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                                <Button asChild size="sm" className="bg-slate-600 hover:bg-slate-700 text-white">
                                                    <Link href={`/dcp-items/${dcp.id}`} preserveState={false} preserveScroll={false}>Items</Link>
                                                </Button>                                                
                                                <Button asChild size="sm">
                                                    <Link href={`/dcp-recipients/${dcp.id}`} preserveState={false} preserveScroll={false}>Recipients</Link>
                                                </Button>

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <div className="mb-5 flex items-center justify-between">
                        {allDcps.total > 0 && (
                            <div className="text-sm text-muted-foreground mt-4">
                                Showing {allDcps.from} - {allDcps.to} of {allDcps.total} dcps
                            </div>
                        )}
                        <InertiaPagination links={allDcps.links} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
