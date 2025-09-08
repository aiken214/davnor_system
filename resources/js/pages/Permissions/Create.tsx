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
        title: 'Create Permission',
        href: '/permissions',
    },
];

export default function Dashboard() {

    const { data, setData, post, errors, processing } = useForm<{
        name: string;
    }>({
        name: '',
    });

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/permissions');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Permission" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">                    
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">Create Permission</div>
                        <Button>
                            <Link href="/permissions"  
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
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Name
                                    </Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        placeholder="Enter permission name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        aria-invalid={!!errors.name}
                                    />
                                    <InputError message={errors.name} />
                                </div>          

                                <div className="mt-4 text-end">
                                    <Button size={'lg'} type="submit" disabled={processing} variant="default">
                                        {processing && <Loader2 className="animate-spin" />}
                                        <span>Save</span>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </AppLayout>
    );
}
