// resources/js/Pages/Tickets/Show.tsx

import { useForm, usePage } from '@inertiajs/react';
import React from 'react';

export default function Show({ ticket }: { ticket: any }) {
    const { data, setData, post, processing, reset } = useForm({
        message: ''
    });

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/tickets/${ticket.id}/comments`, {
            preserveScroll: true,
            onSuccess: () => reset('message')
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-2">{ticket.subject}</h1>
            <p className="text-sm text-gray-600 mb-4">Status: {ticket.status.toUpperCase()}</p>

            <div className="mb-6 border p-4 rounded bg-gray-50">
                <p className="mb-2"><strong>Category:</strong> {ticket.category.name}</p>
                <p className="mb-2"><strong>Priority:</strong> {ticket.priority}</p>
                <p className="mb-2"><strong>Reported By:</strong> {ticket.user.name}</p>
                <p><strong>Description:</strong></p>
                <p className="whitespace-pre-wrap mt-1">{ticket.description}</p>
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Attachments</h2>
                {ticket.attachments.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {ticket.attachments.map((att: any) => (
                            <li key={att.id}>
                                <a
                                    href={`/attachments/${att.id}/download`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {att.file_name}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : <p>No attachments.</p>}
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Comments</h2>
                {ticket.comments.map((comment: any) => (
                    <div key={comment.id} className="border-b py-2">
                        <p className="text-sm text-gray-700">{comment.user.name}:</p>
                        <p className="ml-2 whitespace-pre-wrap">{comment.message}</p>
                    </div>
                ))}
            </div>

            <form onSubmit={handleCommentSubmit} className="mt-4">
                <textarea
                    value={data.message}
                    onChange={e => setData('message', e.target.value)}
                    className="w-full border rounded p-2 mb-2"
                    rows={3}
                    placeholder="Add a comment..."
                />
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Post Comment
                </button>
            </form>
        </div>
    );
}
