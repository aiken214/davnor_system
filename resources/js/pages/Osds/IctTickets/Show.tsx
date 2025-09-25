import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'ICT Tickets', href: '/tickets' },
    { title: 'View Ticket', href: '#' },
];

export default function ShowTicket({ ticket }: { ticket: any }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Ticket #${ticket.id}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">Ticket Details</div>
                        <Button asChild>
                            <Link href="/tickets">Back</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <Detail label="ID" value={ticket.id} />
                            <Detail label="Subject" value={ticket.subject} />
                            <Detail label="Description" value={ticket.description} />
                            <Detail label="Priority" value={ticket.priority} />
                            <Detail label="Status" value={ticket.status} />
                            <Detail label="Category" value={ticket.category?.name} />
                            <Detail label="Created By" value={ticket.user?.name} />
                            <Detail label="Assigned To" value={ticket.assigned_to?.name ?? 'Unassigned'} />

                            {ticket.attachments && ticket.attachments.length > 0 ? (
                                <div className="md:flex md:items-start md:gap-4">
                                    <div className="md:w-50 font-medium text-gray-700">Attachments:</div>
                                    <div className="flex-1 flex flex-col gap-1">
                                        {ticket.attachments.map((file: any) => (
                                            <AttachmentModal key={file.id} file={file} />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No Attachment</p>
                            )}

                            <Detail label="Created At" value={new Date(ticket.created_at).toLocaleString()} />
                            <Detail label="Updated At" value={new Date(ticket.updated_at).toLocaleString()} />
                        </CardContent>
                    </Card>

                    {/* Comments */}
                    <div className="mt-8">
                        <div className="text-lg font-semibold mb-3">Comments</div>
                        {ticket.comments.length > 0 ? (
                            ticket.comments.map((comment: any) => (
                                <div key={comment.id} className="border p-3 mb-2 rounded-md bg-gray-50">
                                    <div className="text-sm font-medium text-gray-700">
                                        {comment.user?.name} –{' '}
                                        <span className="text-xs text-gray-500">
                                            {new Date(comment.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="mt-1 text-gray-800">{comment.message}</div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">No comments yet.</p>
                        )}
                    </div>

                    {/* Logs */}
                    <div className="mt-8">
                        <div className="text-lg font-semibold mb-3">Change Logs</div>
                        {ticket.logs.length > 0 ? (
                            <ul className="space-y-2">
                                {ticket.logs.map((log: any) => (
                                    <li key={log.id} className="text-sm text-gray-700">
                                        <span className="font-medium">{log.user?.name}</span> changed{' '}
                                        <span className="text-gray-900 font-medium">{log.action}</span> from{' '}
                                        <span className="text-red-600">{log.old_value ?? 'N/A'}</span> to{' '}
                                        <span className="text-green-600">{log.new_value ?? 'N/A'}</span>{' '}
                                        <span className="text-gray-500">
                                            ({new Date(log.created_at).toLocaleString()})
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic">No logs available.</p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function Detail({ label, value }: { label: string; value: any }) {
    return (
        <div className="md:flex md:items-start md:gap-4">
            <div className="md:w-50 font-medium text-gray-700">{label}:</div>
            <div className="flex-1 break-words">{value ?? '—'}</div>
        </div>
    );
}

function AttachmentModal({ file }: { file: any }) {
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
                <DialogTitle>View File</DialogTitle>
                <div className="flex items-center justify-between px-4 py-2 border-b bg-white">
                    <h2 className="text-base font-semibold">Preview</h2>
                    <DialogClose asChild>
                        <button className="text-gray-600 hover:text-black p-1 rounded-md transition">
                            <X className="h-5 w-5" />
                        </button>
                    </DialogClose>
                </div>

                <iframe
                    src={`/storage/${file.file_path}`}
                    title={file.filename}
                    className="flex-1 w-full h-full"
                />
            </DialogContent>
        </Dialog>
    );
}
