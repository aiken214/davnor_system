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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create SBM Checklist',
        href: '/sbm-checklists',
    },
];

export default function Dashboard() {

    const { data, setData, post, errors, processing } = useForm<{
        title: string;
        school_year: string;
    }>({
        title: '',
        school_year: '',
    });

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/sbm-checklists');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create SBM Checklist" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">Create SBM Checklist</div>
                        <Button>
                            <Link href="/sbm-checklists"
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
                                        <Label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                            Title
                                        </Label>
                                        <Input
                                            type="text"
                                            id="title"
                                            placeholder="Enter title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            aria-invalid={!!errors.title}
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="school_year" className="block text-sm font-medium text-gray-700">
                                            School Year
                                        </Label>
                                        <Input
                                            type="text"
                                            id="school_year"
                                            placeholder="Enter permission name"
                                            value={data.school_year}
                                            onChange={(e) => setData('school_year', e.target.value)}
                                            aria-invalid={!!errors.school_year}
                                        />
                                        <InputError message={errors.school_year} />
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
