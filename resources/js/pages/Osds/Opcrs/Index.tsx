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
        title: 'OPCRs',
        href: '/opcrs',
    },
];

interface LinksType {
    url: string | null;
    label: string;
    active: boolean;
}

interface OpcrType {
    id: number;
    title: string;
    period: string;
    rating: number;
    rater: string;
    file: string;
    status: string;
    remarks: string;
}

interface OpcrsType {
    data: OpcrType[];
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

function ApprovalModal({ opcrId }: { opcrId: number }) {
    const { data, setData, post, processing, reset } = useForm({
        status: '',
        remarks: '',
    });

    const handleSubmit = () => {
        if (!data.status) return;

        post(`/opcrs/${opcrId}/approve`, {
            onSuccess: () => {
                reset(); // Clear form after successful submission
            },
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="sm" className="bg-slate-600 hover:bg-slate-700 text-white">
                    Review
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Review OPCR</AlertDialogTitle>
                    <AlertDialogDescription>Select status and confirm your decision.</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="my-4 space-y-2">
                    <label htmlFor="status" className="text-sm font-medium">Status</label>
                    <select
                        id="status"
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                        <option value="">-- Select Status --</option>
                        <option value="approved">Approve</option>
                        <option value="disapproved">Disapprove</option>
                    </select>

                    <label htmlFor="remarks" className="text-sm font-medium">Remarks</label>
                    <textarea
                        id="remarks"
                        value={data.remarks}
                        onChange={(e) => setData('remarks', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                        rows={3} // or any row height you want
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleSubmit}
                        disabled={!data.status || processing}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Submit
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default function OpcrsIndex({ opcrs }: { opcrs: OpcrsType }) {
    const { flash } = usePage<{ flash: { message?: string } }>().props;
    const [allOpcrs, setAllOpcrs] = useState<OpcrsType>(opcrs);

    useEffect(() => {
        setAllOpcrs(opcrs);
    }, [opcrs]);

    useEffect(() => {
        let channel: any;
        if (typeof window !== 'undefined' && window.Echo) {
            channel = window.Echo.channel('opcrs').listen(
                'OpcrUpdated',
                ({ opcr }: { opcr: OpcrType }) => {
                    setAllOpcrs((prev) => ({
                        ...prev,
                        data: prev.data.map((p) => (p.id === opcr.id ? opcr : p)),
                    }));
                },
            );
        }
        if (flash.message) toast.success(flash.message);
        return () => {
            if (channel) channel.stopListening('OpcrUpdated');
            if (window.Echo) window.Echo.leave('opcrs');
        };
    }, [flash.message]);

    const handleSearch = useRef(
        debounce((query: string) => {
            router.get('/opcrs', { search: query }, { replace: true });
        }, 500),
    ).current;

    function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value;
        handleSearch(query);
    }

    function deleteOpcr(id: number) {
        router.delete(`/opcrs/${id}`);
        toast.success('Opcr deleted successfully');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="OPCRS" />
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
                            <Link href="/opcrs/create" prefetch>
                                Create OPCR
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Period</TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead>Rater</TableHead>
                                        <TableHead>File</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Remarks</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allOpcrs.data.map((opcr, index) => (
                                        <TableRow key={opcr.id}>
                                            <TableCell className="w-15">{(allOpcrs.from ?? 0) + index}</TableCell>
                                            <TableCell>{opcr.title}</TableCell>
                                            <TableCell>{opcr.period}</TableCell>
                                            <TableCell>{opcr.rating}</TableCell>
                                            <TableCell>{opcr.rater}</TableCell>
                                            <TableCell>{opcr.file ? <PdfModal file={opcr.file} /> : <span className="text-gray-400 italic">No file</span>}</TableCell>
                                            <TableCell>
                                                {opcr.status == '0' && <Badge className="bg-yellow-500">Pending</Badge>}
                                                {opcr.status == '1' && <Badge className="bg-green-500">Approved</Badge>}
                                                {opcr.status == '2' && <Badge className="bg-red-600">Disapproved</Badge>}
                                            </TableCell>
                                            <TableCell>{opcr.remarks}</TableCell>
                                            <TableCell className="w-50 space-x-1">
                                                <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                                    <Link href={`/opcrs/${opcr.id}`} prefetch>View</Link>
                                                </Button>
                                                {opcr.status != '1' && (
                                                    <>
                                                        <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                                            <Link href={`/opcrs/${opcr.id}/edit`} preserveState={false} preserveScroll={false}>Edit</Link>
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button size="sm" className="cursor-pointer bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you sure you want to delete this OPCR?</AlertDialogTitle>
                                                                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteOpcr(opcr.id)}>Confirm Delete</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </>
                                                )}
                                                {can('opcr_approve') && (<ApprovalModal opcrId={opcr.id} />)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <div className="mb-5 flex items-center justify-between">
                        {allOpcrs.total > 0 && (
                            <div className="text-sm text-muted-foreground mt-4">
                                Showing {allOpcrs.from} - {allOpcrs.to} of {allOpcrs.total} opcrs
                            </div>
                        )}
                        <InertiaPagination links={allOpcrs.links} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
