import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'OPCRs',
        href: '/opcrs',
    },
    {
        title: 'Edit OPCR',
        href: '/opcrs',
    },
];

interface EditProps {
    opcr: {
        id: number;
        title: string;
        period: string;
        rating: number;
        rater: string;
        file: string | null;
    };
}

export default function Edit({ opcr }: EditProps) {
    const { data, setData, post, errors, processing } = useForm<{
        _method: string;
        title: string;
        period: string;
        rating: number;
        rater: string;
        file: File | null;
    }>({
        _method: 'put',
        title: opcr.title,
        period: opcr.period,
        rating: opcr.rating,
        rater: opcr.rater,
        file: null,
    });

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(`/opcrs/${opcr.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit OPCR" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">Edit OPCR</div>
                        <Button>
                            <Link href="/opcrs" preserveState={false} preserveScroll={false}>
                                Back
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <form onSubmit={handleFormSubmit}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Enter OPCR title"
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="period">Rating Period</Label>
                                        <Input
                                            id="period"
                                            value={data.period}
                                            onChange={(e) => setData('period', e.target.value)}
                                            placeholder="Enter OPCR rating period"
                                        />
                                        <InputError message={errors.period} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="rating">Rating</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            id="rating"
                                            value={data.rating}
                                            onChange={(e) => setData('rating', parseFloat(e.target.value))}
                                            placeholder="Enter OPCR rating"
                                        />
                                        <InputError message={errors.rating} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="rater">Rater</Label>
                                        <Input
                                            id="rater"
                                            value={data.rater}
                                            onChange={(e) => setData('rater', e.target.value)}
                                            placeholder="Enter OPCR rater"
                                        />
                                        <InputError message={errors.rater} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="file">Replace File (PDF)</Label>
                                        <Input
                                            type="file"
                                            id="file"
                                            accept="application/pdf"
                                            onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                                        />
                                        <InputError message={errors.file} />

                                        {opcr.file && !data.file && (
                                            <div className="mt-2">
                                                <embed
                                                    src={`/storage/${opcr.file}`}
                                                    type="application/pdf"
                                                    className="w-full h-64 border"
                                                />
                                            </div>
                                        )}

                                        {data.file && (
                                            <div className="mt-2">
                                                <embed
                                                    src={URL.createObjectURL(data.file)}
                                                    type="application/pdf"
                                                    className="w-full h-64 border"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 text-end">
                                        <Button type="submit" size="lg" disabled={processing}>
                                            {processing && <Loader2 className="animate-spin mr-2" />}
                                            <span>Update</span>
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
