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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'ICT Helpdesk Tickets',
        href: '/tickets',
    },
    {
        title: 'Create ICT Helpdesk Ticket',
        href: '#',
    },
];

export default function Create({ categories }: { categories: any[] }) {

    const { data, setData, post, errors, processing } = useForm<{
        category_id: number | '';
        subject: string;
        description: string;
        priority: string;
        file: File | null;
    }>({
        category_id: '',
        subject: '',
        description: '',
        priority: 'medium',
        file: null as File | null,
    });

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/tickets');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create DCP Batch" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">Create HelpDesk Ticket</div>
                        <Button>
                            <Link href="/tickets"
                                preserveState={false}
                                preserveScroll={false}
                            >
                                Back
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <form onSubmit={handleFormSubmit}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                                            Category
                                        </Label>
                                        <select
                                            value={data.category_id}
                                            onChange={e => setData('category_id', parseInt(e.target.value))}
                                            className="w-full border rounded p-2"
                                        >
                                            <option value="">-- Select Category --</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>{category.name}</option>
                                            ))}
                                        </select>
                                        {errors.category_id && <div className="text-red-500 text-sm">{errors.category_id}</div>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                            Subject
                                        </Label>
                                        <Input
                                            type="text"
                                            id="subject"
                                            placeholder="Enter subject"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            aria-invalid={!!errors.subject}
                                        />
                                        <InputError message={errors.subject} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                            Description
                                        </Label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={3}
                                            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                                            Priority
                                        </Label>
                                        <select
                                            value={data.priority}
                                            onChange={e => setData('priority', e.target.value)}
                                            className="w-full border rounded p-2"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="file" className="block text-sm font-medium text-gray-700">
                                            Attachment (optional)
                                        </Label>
                                        <Input
                                            type="file"
                                            id="file"
                                            accept="application/pdf" // ✅ Accept only PDF files
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setData('file', file);
                                                }
                                            }}
                                            aria-invalid={!!errors.file}
                                        />
                                        <InputError message={errors.file} />

                                        {data.file && (
                                            <div className="mt-2">
                                                <embed
                                                    src={URL.createObjectURL(data.file as Blob)}
                                                    type="application/pdf"
                                                    className="w-full h-64 border"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 text-end">
                                        <Button size={'lg'} type="submit" disabled={processing} variant="default">
                                            {processing && <Loader2 className="animate-spin" />}
                                            <span>Save</span>
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
