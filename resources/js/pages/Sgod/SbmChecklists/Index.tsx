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
import { can } from '@/lib/can';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'SBM Checklists',
        href: '/sbm-checklists',
    },
];

interface LinksType {
    url: string | null;
    label: string;
    active: boolean;
}

interface SbmChecklistType {
    id: number;
    title: string;
    school_year: string;
    status: string;
    remarks: string;
}

interface SbmChecklistsType {
    data: SbmChecklistType[];
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

function ApprovalModal({ sbm_checklistId }: { sbm_checklistId: number }) {
    const { data, setData, post, processing, reset } = useForm({
        status: '',
        remarks: '',
    });

    const handleSubmit = () => {
        if (!data.status) return;

        post(`/sbm-checklists/${sbm_checklistId}/approve`, {
            onSuccess: () => {
                reset(); // Clear form after successful submission
            },
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="sm" className="cursor-pointer bg-slate-600 hover:bg-slate-700 text-white">
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

export default function SbmChecklistsIndex({ sbm_checklists }: { sbm_checklists: SbmChecklistsType }) {
    const { flash } = usePage<{ flash: { message?: string } }>().props;

    // Initialize state with full paginated object
    const [allSbmChecklists, setAllSbmChecklists] = useState<SbmChecklistsType>(sbm_checklists);

    // Sync local state if the SBM checklists prop changes.
    useEffect(() => {
        setAllSbmChecklists(sbm_checklists);
    }, [sbm_checklists]);

    useEffect(() => {
        let channel: any;

        if (typeof window !== 'undefined' && window.Echo) {
            channel = window.Echo.channel('sbm_checklists').listen(
                'SbmChecklistUpdated',
                ({ sbm_checklist }: { sbm_checklist: SbmChecklistType }) => {
                    setAllSbmChecklists((prev) => ({
                        ...prev,
                        data: prev.data.map((p) => (p.id === sbm_checklist.id ? sbm_checklist : p)),
                    }));
                },
            );
        }

        if (flash.message) toast.success(flash.message);

        return () => {
            if (channel) channel.stopListening('SbmChecklistUpdated');
            if (window.Echo) window.Echo.leave('sbm_checklists');
        };
    }, [flash.message]);

    // Debounced search function
    const handleSearch = useRef(
        debounce((query: string) => {
            router.get('/sbm-checklists', { search: query }, { replace: true });
        }, 500),
    ).current;

    function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value;
        handleSearch(query);
    }

    function deleteSbmChecklist(id: number) {
        router.delete(`/sbm-checklists/${id}`);
        toast.success('SBM Checklist deleted successfully');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="SBM Checklists" />

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
                        {/* Buttons - aligned right */}
                        <div className="flex gap-1">
                            {can('sbm_indicator_access') && (
                                <Button asChild className="bg-gray-600 hover:bg-gray-700 text-white">
                                    <Link href="/sbm-indicators" prefetch>
                                        SBM Indicators
                                    </Link>
                                </Button>
                            )}
                            <Button asChild>
                                <Link href="/sbm-checklists/create" prefetch>
                                    Create SBM Checklist
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
                                        <TableHead>Title</TableHead>
                                        <TableHead>School Year</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Remarks</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allSbmChecklists.data.map((sbm_checklist, index) => (
                                        <TableRow key={sbm_checklist.id}>
                                            <TableCell className="w-15">{(allSbmChecklists.from ?? 0) + index}</TableCell>
                                            <TableCell>{sbm_checklist.title}</TableCell>
                                            <TableCell>{sbm_checklist.school_year}</TableCell>
                                            <TableCell>
                                                {sbm_checklist.status == '0' && <Badge className="bg-yellow-500">Pending</Badge>}
                                                {sbm_checklist.status == '1' && <Badge className="bg-green-500">Approved</Badge>}
                                                {sbm_checklist.status == '2' && <Badge className="bg-red-600">Disapproved</Badge>}
                                            </TableCell>
                                            <TableCell>{sbm_checklist.remarks}</TableCell>
                                            <TableCell className="w-50 space-x-1">

                                                <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                                    <Link href={`/sbm-checklists/${sbm_checklist.id}`} prefetch>
                                                        View
                                                    </Link>
                                                </Button>
                                                {sbm_checklist.status != '1' && (
                                                    <>
                                                        <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                                            <Link href={`/sbm-checklists/${sbm_checklist.id}/edit`}
                                                                preserveState={false}
                                                                preserveScroll={false}
                                                            >
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
                                                                    <AlertDialogTitle>Are you sure you want to delete this SBM checklist?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. The SBM checklist will be permanently removed.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                        onClick={() => deleteSbmChecklist(sbm_checklist.id)}
                                                                    >
                                                                        Confirm Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </>
                                                )}
                                                {can('sbm_checklist_approve') && (<ApprovalModal sbm_checklistId={sbm_checklist.id} />)}                                                
                                                <Button asChild size="sm">
                                                    <Link href={`/sbm-checklists/print/${sbm_checklist.id}`}
                                                        preserveState={false}
                                                        preserveScroll={false}
                                                    >
                                                        Print
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <div className="mb-5 flex items-center justify-between">
                        {allSbmChecklists.total > 0 && (
                            <div className="text-sm text-muted-foreground mt-4">
                                Showing {allSbmChecklists.from} - {allSbmChecklists.to} of {allSbmChecklists.total} sbm_checklists
                            </div>
                        )}
                        <InertiaPagination links={allSbmChecklists.links} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

