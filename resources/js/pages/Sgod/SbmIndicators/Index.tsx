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
        title: 'SBM Indicators',
        href: '/sbm-indicators',
    },
];

interface LinksType {
    url: string | null;
    label: string;
    active: boolean;
}

interface SbmIndicatorType {
    id: number;
    description: string;
    area: string;
}

interface SbmIndicatorsType {
    data: SbmIndicatorType[];
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

export default function SbmIndicatorsIndex({ sbm_indicators }: { sbm_indicators: SbmIndicatorsType }) {
    const { flash } = usePage<{ flash: { message?: string } }>().props;

    // Initialize state with full paginated object
    const [allSbmIndicators, setAllSbmIndicators] = useState<SbmIndicatorsType>(sbm_indicators);

    // Sync local state if the SBM indicators prop changes.
    useEffect(() => {
        setAllSbmIndicators(sbm_indicators);
    }, [sbm_indicators]);

    useEffect(() => {
        let channel: any;

        if (typeof window !== 'undefined' && window.Echo) {
            channel = window.Echo.channel('sbm_indicators').listen(
                'SbmIndicatorUpdated',
                ({ sbm_indicator }: { sbm_indicator: SbmIndicatorType }) => {
                    setAllSbmIndicators((prev) => ({
                        ...prev,
                        data: prev.data.map((p) => (p.id === sbm_indicator.id ? sbm_indicator : p)),
                    }));
                },
            );
        }

        if (flash.message) toast.success(flash.message);

        return () => {
            if (channel) channel.stopListening('SbmIndicatorUpdated');
            if (window.Echo) window.Echo.leave('sbm_indicators');
        };
    }, [flash.message]);

    // Debounced search function
    const handleSearch = useRef(
        debounce((query: string) => {
            router.get('/sbm-indicators', { search: query }, { replace: true });
        }, 500),
    ).current;

    function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value;
        handleSearch(query);
    }

    function deleteSbmIndicator(id: number) {
        router.delete(`/sbm-indicators/${id}`);
        toast.success('SBM Indicator deleted successfully');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="SBM Indicators" />

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
                            <Link href="/sbm-indicators/create" prefetch>
                                Create SBM Indicator
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
                                        <TableHead>Area of School Operation</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allSbmIndicators.data.map((sbm_indicator, index) => (
                                        <TableRow key={sbm_indicator.id}>
                                            <TableCell className="w-15">{(allSbmIndicators.from ?? 0) + index}</TableCell>
                                            <TableCell>{sbm_indicator.description}</TableCell>
                                            <TableCell>{sbm_indicator.area}</TableCell>
                                            <TableCell className="w-50 space-x-1">

                                                <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                                    <Link href={`/sbm-indicators/${sbm_indicator.id}`} prefetch>
                                                        View
                                                    </Link>
                                                </Button>

                                                <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                                    <Link href={`/sbm-indicators/${sbm_indicator.id}/edit`} 
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
                                                            <AlertDialogTitle>Are you sure you want to delete this SBM indicator?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. The SBM indicator will be permanently removed.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-600 hover:bg-red-700"
                                                                onClick={() => deleteSbmIndicator(sbm_indicator.id)}
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
                        {allSbmIndicators.total > 0 && (
                            <div className="text-sm text-muted-foreground mt-4">
                                Showing {allSbmIndicators.from} - {allSbmIndicators.to} of {allSbmIndicators.total} sbm_indicators
                            </div>
                        )}
                        <InertiaPagination links={allSbmIndicators.links} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
