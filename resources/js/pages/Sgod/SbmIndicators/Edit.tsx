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
        title: 'Edit SBM Indicator',
        href: '/sbm-indicators',
    },
];

interface EditSbmIndicatorProps {
    sbm_indicator: {
        id: number;
        description: string;
        area: string;
    };
}

export default function Edit({ sbm_indicator }: EditSbmIndicatorProps) {
    const { data, setData, put, errors, processing } = useForm<{
        description: string;
        area: string;
    }>({
        description: sbm_indicator.description || '',
        area: sbm_indicator.area || '',
    });

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(`/sbm-indicators/${sbm_indicator.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit SBM Indicator" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">Edit SBM Indicator</div>
                        <Button>
                            <Link
                                href="/sbm-indicators"
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
                                        <Label htmlFor="description">
                                            Indicator
                                        </Label>
                                        <Input
                                            type="text"
                                            id="description"
                                            placeholder="Enter indicator description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            aria-invalid={!!errors.description}
                                        />
                                        <InputError message={errors.description} />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <Label htmlFor="area">Area of School Operation</Label>
                                        <Select value={data.area} onValueChange={(value) => setData('area', value)}>
                                            <SelectTrigger id="area" aria-invalid={!!errors.area}>
                                                <SelectValue placeholder="Select area of school operation" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Curriculum and Teaching">Curriculum and Teaching</SelectItem>
                                                <SelectItem value="Learning Environment">Learning Environment</SelectItem>
                                                <SelectItem value="Leadership">Leadership</SelectItem>
                                                <SelectItem value="Governance and Accountability">Governance and Accountability</SelectItem>
                                                <SelectItem value="Human Resource and Team Development">Human Resource and Team Development</SelectItem>
                                                <SelectItem value="Finance and Resource Management and Mobilization">Finance Resource Management and Mobilization</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.area} />
                                    </div>

                                    <div className="mt-4 text-end">
                                        <Button size="lg" type="submit" disabled={processing} variant="default">
                                            {processing && <Loader2 className="animate-spin" />}
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
