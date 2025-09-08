import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'SBM Checklists',
        href: '/sbm-checklists',
    },
    {
        title: 'Edit Responses',
        href: '#',
    },
];

export default function Edit({
        indicators,
        sbmChecklistId,
        responses,
    }: {
        indicators: any[];
        sbmChecklistId: number;
        responses: any[];
    }) {
    const { data, setData, put, processing } = useForm({
        sbm_checklist_id: sbmChecklistId,
        responses: indicators.map((indicator) => {
            const existing = responses.find(r => r.indicator_id === indicator.id);
            return {
                indicator_id: indicator.id,
                status: existing?.status ?? '',
                remarks: existing?.remarks ?? '',
            };
        }),
    });

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(`/sbm-responses/${sbmChecklistId}`);
    }

    const handleStatusChange = (index: number, value: string) => {
        const updated = [...data.responses];
        updated[index].status = value;
        setData('responses', updated);
    };

    const handleRemarksChange = (index: number, value: string) => {
        const updated = [...data.responses];
        updated[index].remarks = value;
        setData('responses', updated);
    };

    const statusOptions = [
        'Not yet manifested',
        'Rarely manifested',
        'Frequently manifested',
        'Always manifested',
    ];

    // Descriptions for each area (used only for printing)
    const areaDescriptions: Record<string, string> = {
        'Curriculum and Teaching':
            'School personnel and stakeholders work collaboratively to enhance learning standards to continually build a relevant and inclusive learning community and achieve improved learning outcomes.',
        'Learning Environment':
            'The school and its community work collaboratively to ensure equitable access to a learner-centered, motivating, healthy, safe, secure, inclusive, resilient, and enabling learning environement and to achieve improved learning outcomes.',
        'Leadership':
            'School personnel and stakeholders are empowered and actively engaged in taking on appropriate leadership roles and responsibilities to continuously improve the school for improved learning outcomes.',
        'Governance and Accountability':
            'The school and its community come together to take responsibility for ensuring participation, transparency, and accountability, as well as the implementation of a plan to continuously improve the delivery of basic education services, organizational health, and performance for improved learning outcomes.',
        'Human Resource and Team Development':
            'School personnel collaborate to continuously improve individual capabilities and team capacity to create an environment that shall yield high performance for improved learning outcomes.',
        'Finance and Resource Management and Mobilization':
            'The school judiciously manages and mobilizes resources to support programs, projects, and activities that contribute to the improvement of learning outcomes.',
    };
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit SBM Responses" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-lg text-slate-600">Edit SBM Responses</div>
                        <Button>
                            <Link href="/sbm-checklists" preserveState={false} preserveScroll={false}>
                                Back
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <table className="w-full border text-sm">
                                    <thead>
                                        <tr className="bg-slate-100">
                                            <th rowSpan={2} className="w-[4%] border px-3 py-2 text-center">#</th>
                                            <th rowSpan={2} className="w-[50%] border px-3 py-2 text-center">SBM Indicators</th>
                                            <th colSpan={4} className="border px-3 py-2 text-center">Degree of Manifestation</th>
                                            <th rowSpan={2} className="w-[15%]border px-3 py-2 text-center">Remarks</th>
                                        </tr>
                                        <tr className="bg-slate-100">
                                            <th className="w-[7%] border px-2 py-2 text-center">Not yet manifested</th>
                                            <th className="w-[7%] border px-2 py-2 text-center">Rarely manifested</th>
                                            <th className="w-[7%] border px-2 py-2 text-center">Frequently manifested</th>
                                            <th className="w-[7%] border px-2 py-2 text-center">Always manifested</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
                                            let currentArea = '';
                                            return indicators.map((indicator, index) => {
                                                const showAreaHeader = indicator.area !== currentArea;
                                                currentArea = indicator.area;

                                                return (
                                                    <React.Fragment key={indicator.id}>
                                                        {showAreaHeader && (
                                                            <tr className="bg-slate-200">
                                                                <td colSpan={8} className="font-semibold px-3 py-2 text-slate-700">
                                                                    {indicator.area}
                                                                    {areaDescriptions[indicator.area] && (
                                                                        <div className="text-sm font-normal text-gray-600 mt-1">
                                                                            {areaDescriptions[indicator.area]}
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )}
                                                        <tr>
                                                            <td className="border px-3 py-2 text-center">
                                                                {index + 1}
                                                            </td>
                                                            <td className="border px-3 py-2">
                                                                {indicator.description}
                                                                <input
                                                                    type="hidden"
                                                                    name={`responses[${index}][indicator_id]`}
                                                                    value={indicator.id}
                                                                />
                                                            </td>
                                                            {statusOptions.map((option) => (
                                                                <td key={option} className="border px-3 text-center">
                                                                    <input
                                                                        type="radio"
                                                                        className="w-5 h-5"
                                                                        name={`responses[${index}][status]`}
                                                                        value={option}
                                                                        checked={data.responses[index].status === option}
                                                                        onChange={() => handleStatusChange(index, option)}
                                                                    />
                                                                </td>
                                                            ))}
                                                            <td className="border px-0 py-0">
                                                                <textarea
                                                                    name={`responses[${index}][remarks]`}
                                                                    className="w-full text-sm p-1"
                                                                    rows={2}
                                                                    value={data.responses[index].remarks}
                                                                    onChange={(e) =>
                                                                        handleRemarksChange(index, e.target.value)
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>
                                                );
                                            });
                                        })()}
                                    </tbody>
                                </table>
                                <div className="mt-4 text-end">
                                    <Button size="lg" type="submit" disabled={processing} variant="default">
                                        {processing && <Loader2 className="animate-spin mr-2" />}
                                        <span>Update</span>
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
