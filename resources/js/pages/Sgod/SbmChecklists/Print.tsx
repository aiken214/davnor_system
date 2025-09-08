import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'SBM Checklists', href: '/sbm-checklists' },
    { title: 'View SBM Checklist', href: '#' },
];

interface SbmChecklistType {
    id: number;
    title: string;
    school_year: string;
    status: string;
    remarks: string;
}

export default function PrintSbmChecklist({
    sbm_checklist,
    indicators,
    sbmChecklistId,
    responses,
}: {
    sbm_checklist: SbmChecklistType;
    indicators: any[];
    sbmChecklistId: number;
    responses: any[];
}) {
    const statusOptions = [
        'Not yet manifested',
        'Rarely manifested',
        'Frequently manifested',
        'Always manifested',
    ];

    const responseMap = Object.fromEntries(
        responses.map(r => [r.indicator_id, r])
    );

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
            <Head title={`SBM Checklist: ${sbm_checklist.title}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between print:hidden">
                        <div className="text-lg text-slate-600">SBM Checklist Details</div>
                        <div className="flex gap-1">
                            <Button
                                className="cursor-pointer bg-gray-600 hover:bg-gray-700 text-white"
                                onClick={() => window.print()}
                            >
                                Print
                            </Button>

                            <Button asChild>
                                <Link href="/sbm-checklists" prefetch>
                                    Back
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <Card className="print:shadow-none print:border-0 print:p-0">
                        <CardContent className="print:p-0 print:overflow-visible">
                            <div className="printable print:block" style={{ margin: '0', overflow: 'visible', display: 'block' }}>                             
                                <div className="pb-2">
                                    <strong>Title:</strong> {sbm_checklist.title}
                                </div>
                                <div>
                                    <strong>School Year:</strong> {sbm_checklist.school_year}
                                </div>

                                <div className='print-heading text-lg font-semibold text-slate-700 print:text-xl text-center'>
                                    <strong>School-Based Management (SBM) Sefl Assessment Checklist</strong>
                                </div>

                                <table className="w-full border text-sm mt-4">
                                    <thead>
                                        <tr className="bg-slate-100">
                                            <th rowSpan={2} className="w-[4%] border px-2 py-2 text-center">
                                                #
                                            </th>
                                            <th rowSpan={2} className="w-[60%] border px-2 py-2 text-center">
                                                SBM Indicator
                                            </th>
                                            <th colSpan={4} className="w-[20%] border px-2 py-2 text-center">
                                                Degree of Manifestation
                                            </th>
                                            <th rowSpan={2} className="w-[15%] border px-2 py-2 text-center">
                                                Remarks
                                            </th>
                                        </tr>
                                        <tr className="bg-slate-100">
                                            {statusOptions.map(option => (
                                                <th
                                                    key={option}
                                                    className="w-[5%] border px-2 py-2 text-[10px] text-center"
                                                >
                                                    {option}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
                                            let currentArea = '';
                                            return indicators.map((indicator, index) => {
                                                const showAreaHeader = indicator.area !== currentArea;
                                                currentArea = indicator.area;

                                                const response = responseMap[indicator.id];

                                                return (
                                                    <React.Fragment key={indicator.id}>
                                                        {showAreaHeader && (
                                                            <tr className="bg-slate-200">
                                                                <td colSpan={7} className="print-indicator font-semibold px-3 py-2 text-slate-700">
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
                                                            <td className="border px-3 py-2 text-center">{index + 1}</td>
                                                            <td className="print-indicator px-3 py-2 border">{indicator.description}</td>
                                                            {statusOptions.map(option => (
                                                                <td key={option} className="border px-3 text-center">
                                                                    {response?.status === option ? '✔️' : ''}
                                                                </td>
                                                            ))}
                                                            <td className="border px-3 py-2">
                                                                {response?.remarks || ''}
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>
                                                );
                                            });
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
