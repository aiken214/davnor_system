import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { type BreadcrumbItem } from '@/types';

type EditDcpItemProps = {
    dcp: {
        id: number;
        title: string;
    };
    dcp_item: {
        id: number;
        description: string;
        quantity: number;
        dcp_id: number;
    };
};

export default function EditDcpItem({ dcp, dcp_item }: EditDcpItemProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'DCPs',
            href: '/dcps',
        },
        {
            title: 'DCP Items',
            href: `/dcp-items/${dcp_item.dcp_id}`,
        },
        {
            title: `Edit DCP Item`,
            href: `/dcp-items/${dcp_item.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        description: dcp_item.description,
        quantity: dcp_item.quantity,
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(`/dcp-items/${dcp_item.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit DCP Item" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">
                            Edit DCP Item
                        </div>
                        <Button>
                            <Link href={`/dcp-items/${dcp_item.dcp_id}`}>Back</Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Input
                                            id="description"
                                            type="text"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Enter item description"
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="quantity">Quantity</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            value={data.quantity}
                                            onChange={(e) => setData('quantity', parseFloat(e.target.value))}
                                            placeholder="Enter item quantity"
                                        />
                                        <InputError message={errors.quantity} />
                                    </div>

                                    <div className="mt-4 text-end">
                                        <Button type="submit" disabled={processing}>
                                            {processing && (
                                                <Loader2 className="animate-spin mr-2" />
                                            )}
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
