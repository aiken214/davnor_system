import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

type EditProps = {
    categories: {
        id: number;
        name: string;
    }[];
    ticket: {
        id: number;
        category_id: number;
        subject: string;
        description: string;
        priority: string;
        attachments?: {
            id: number;
            ticket_id: number;
            file_path: string | null;
        }[];
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'ICT Helpdesk Tickets',
        href: '/tickets',
    },
    {
        title: 'Edit ICT Helpdesk Ticket',
        href: '#',
    },
];

export default function Edit({ categories, ticket }: EditProps) {
    const { data, setData, post, errors, processing } = useForm<{
        _method: string;
        category_id: number;
        subject: string;
        description: string;
        priority: string;
        file_path: File | null;
        attachment_id: number | null;
    }>({
        _method: 'put',
        category_id: ticket.category_id,
        subject: ticket.subject,
        description: ticket.description,
        priority: ticket.priority,
        file_path: null,
        attachment_id: ticket.attachments?.[0]?.id || null,
    });

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(`/tickets/${ticket.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit ICT Helpdesk Ticket" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">Edit HelpDesk Ticket</div>
                        <Button asChild>
                            <Link href="/tickets" preserveState={false} preserveScroll={false}>
                                Back
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <form onSubmit={handleFormSubmit}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="category_id">Category</Label>
                                        <select
                                            id="category_id"
                                            value={data.category_id}
                                            onChange={e => setData('category_id', parseInt(e.target.value))}
                                            className="w-full border rounded p-2"
                                        >
                                            <option value="">-- Select Category --</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.category_id} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input
                                            type="text"
                                            id="subject"
                                            value={data.subject}
                                            onChange={e => setData('subject', e.target.value)}
                                        />
                                        <InputError message={errors.subject} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            rows={3}
                                            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="priority">Priority</Label>
                                        <select
                                            id="priority"
                                            value={data.priority}
                                            onChange={e => setData('priority', e.target.value)}
                                            className="w-full border rounded p-2"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                        <InputError message={errors.priority} />
                                    </div>

                                    <input type="hidden" value={ticket.attachments?.[0]?.id ?? ''} name="attachment_id" />

                                    <div className="space-y-2">
                                        <Label htmlFor="file_path">Replace File (PDF)</Label>
                                        <Input
                                            type="file"
                                            id="file_path"
                                            accept="application/pdf"
                                            onChange={(e) => setData('file_path', e.target.files?.[0] ?? null)}
                                        />
                                        <InputError message={errors.file_path} />

                                        {ticket.attachments?.[0]?.file_path && !data.file_path && (
                                            <div className="mt-2">
                                                <embed
                                                    src={`/storage/${ticket.attachments?.[0]?.file_path}`}
                                                    type="application/pdf"
                                                    className="w-full h-64 border"
                                                />
                                            </div>
                                        )}

                                        {data.file_path && (
                                            <div className="mt-2">
                                                <embed
                                                    src={URL.createObjectURL(data.file_path)}
                                                    type="application/pdf"
                                                    className="w-full h-64 border"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 text-end">
                                        <Button type="submit" size="lg" disabled={processing}>
                                            {processing && <Loader2 className="animate-spin mr-2" />}
                                            Update
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
