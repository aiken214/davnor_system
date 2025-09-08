import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { type BreadcrumbItem } from '@/types';

type CreateDcpItemProps = {
    dcp: {
        id: number
    };
};

export default function CreateDcpItem({ dcp }: CreateDcpItemProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'DCPs',
            href: '/dcps',
        },
        {
            title: 'DCP Items',
            href: `/dcp-items/${dcp.id}`,
        },
        {
            title: 'Create DCP Item',
            href: '#',
        },
    ];

    const { data, setData, post, errors, processing } = useForm<{
        dcp_id: number;
        description: string;
        quantity: number | '';
    }>({
        dcp_id: dcp.id,
        description: '',
        quantity: '',
    });

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/dcp-items'); // Matches route name (resource)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create DCP Item" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">
                            Create DCP Item
                        </div>
                        <Button>
                            <Link href={`/dcp-items/${dcp.id}`}>Back</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <form onSubmit={handleFormSubmit}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Input
                                            type="text"
                                            id="description"
                                            placeholder="Enter item description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            aria-invalid={!!errors.description}
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="quantity">Quantity</Label>
                                        <Input
                                            type="number"
                                            id="quantity"
                                            placeholder="Enter item quantity"
                                            value={data.quantity}
                                            onChange={(e) =>
                                                setData(
                                                    'quantity',
                                                    e.target.value === ''
                                                        ? ''
                                                        : parseInt(e.target.value)
                                                )
                                            }
                                            aria-invalid={!!errors.quantity}
                                        />
                                        <InputError message={errors.quantity} />
                                    </div>

                                    <div className="mt-4 text-end">
                                        <Button
                                            size="lg"
                                            type="submit"
                                            disabled={processing}
                                            variant="default"
                                        >
                                            {processing && (
                                                <Loader2 className="animate-spin mr-2" />
                                            )}
                                            Save
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
