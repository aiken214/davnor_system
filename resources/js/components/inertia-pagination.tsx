// components/inertia-pagination.tsx
import { Link } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export default function InertiaPagination({ links }: { links: PaginationLink[] }) {
    return (
        <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
            {links.map((link, index) => {
                if (link.url === null) {
                    return (
                        <span
                            key={index}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className="text-sm text-gray-400 px-3 py-1 cursor-not-allowed"
                        />
                    );
                }
                return (
                    <Link
                        key={`${link.label}-${index}`}
                        href={link.url}
                        preserveScroll
                        preserveState
                        className={`text-sm px-3 py-1 rounded border ${
                            link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}
