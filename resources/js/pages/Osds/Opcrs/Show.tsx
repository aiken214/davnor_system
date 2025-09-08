import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'OPCRs',
        href: '/opcrs',
    },
    {
        title: 'View OPCR',
        href: '#',
    },
];

interface OpcrType {
    id: number;
    title: string;
    period: string;
    rating: number;
    rater: string;
    file: string | null;
    status: string;
    created_at?: string;
    updated_at?: string;
}

interface PdfModalProps {
    file: string;
}

export default function ShowOpcr({ opcr }: { opcr: OpcrType }) {

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

                <DialogContent
                    className="!max-w-[80vw] !w-[80vw] !h-[90vh] !p-0 flex flex-col overflow-hidden">
                    {/* Header with Close Button */}
                    <div className="flex items-center justify-between px-4 py-2 border-b bg-white">
                        <h2 className="text-base font-semibold">PDF Preview</h2>
                        <DialogClose asChild>
                            <button
                                className="text-gray-600 hover:text-black p-1 rounded-md transition"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </DialogClose>
                    </div>

                    {/* PDF Viewer */}
                    <iframe
                        src={`/storage/${file}`}
                        title="PDF File"
                        className="flex-1 w-full h-full"
                    />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`OPCR: ${opcr.title}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">OPCR Details</div>
                        <Button asChild>
                            <Link href="/opcrs">Back</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700">ID:</div>
                                    <div className="flex-1 break-words">{opcr.id}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700">Title:</div>
                                    <div className="flex-1 break-words">{opcr.title}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700">Period:</div>
                                    <div className="flex-1 break-words">{opcr.period}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700">Rating:</div>
                                    <div className="flex-1 break-words">{opcr.rating}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700">Rater:</div>
                                    <div className="flex-1 break-words">{opcr.rater}</div>
                                </div>
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700">Status:</div>
                                    <div className="flex-1 break-words">
                                        {opcr.status == '0' ? 'Pending' : opcr.status == '1' ? 'Approved' : 'Disapproved' }
                                    </div>                                    
                                </div>
                                {opcr.file && (
                                    <div className="md:flex md:items-start md:gap-4">
                                        <div className="md:w-50 font-medium text-gray-700">File:</div>
                                        <div className="flex-1 break-words">
                                            {opcr.file ? (
                                                <PdfModal file={opcr.file} />
                                            ) : (
                                                <span className="text-gray-400 italic">No file</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {opcr.created_at && (
                                    <div className="md:flex md:items-start md:gap-4">
                                        <div className="md:w-50 font-medium text-gray-700">Created At:</div>
                                        <div className="flex-1 break-words">
                                            {new Date(opcr.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                )}
                                {opcr.updated_at && (
                                    <div className="md:flex md:items-start md:gap-4">
                                        <div className="md:w-50 font-medium text-gray-700">Updated At:</div>
                                        <div className="flex-1 break-words">
                                            {new Date(opcr.updated_at).toLocaleString()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
