<?php

namespace App\Http\Controllers\Osds;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Ticket;
use App\Models\TicketCategory;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        abort_unless(auth()->user()->can('ict_helpdesk_access'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $query = Ticket::with(['category', 'user', 'assignedTo']);

        if ($request->filled('search')) {
            $query->whereHas('school', fn ($q) =>
                $q->where('subject', 'like', '%' . $request->search . '%')
                    ->orwhere('description', 'like', '%' . $request->search . '%')
            );
        }

        $tickets = $query->latest()->paginate(10);

        return Inertia::render('Osds/IctTickets/Index', [
            'tickets' => $tickets,
        ]);
    }

    public function create()
    {
        abort_unless(auth()->user()->can('ict_helpdesk_create'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        return Inertia::render('Osds/IctTickets/Create', [
            'categories' => TicketCategory::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:ticket_categories,id',
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high,urgent',
        ]);

        $ticket = Ticket::create([
            'user_id' => auth()->id(),
            'category_id' => $request->category_id,
            'subject' => $request->subject,
            'description' => $request->description,
            'priority' => $request->priority,
        ]);

        // return redirect()->route('tickets.show', $ticket);
        return to_route('tickets.index')->with('message', 'DCP batch created successfully.');
    }

    public function show(Ticket $ticket)
    {
        abort_unless(auth()->user()->can('ticket_show'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $ticket->load(['comments.user', 'attachments', 'logs', 'category', 'user', 'assignedTo']);

        return Inertia::render('Tickets/Show', [
            'ticket' => $ticket,
        ]);
    }

    public function edit(Ticket $ticket)
    {

        abort_unless(auth()->user()->can('ticket_edit'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $ticket->load(['comments.user', 'attachments', 'logs', 'category', 'user', 'assignedTo']);

        return Inertia::render('Osds/IctTickets/Edit', [
            'ticket' => $ticket,
            'categories' => TicketCategory::all(),
        ]);
    }

    public function update(Request $request, Ticket $ticket)
    {
        $request->validate([
            'status' => 'required|in:open,in_progress,resolved,closed',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $ticket->update($request->only('status', 'assigned_to'));

        return back();
    }

    public function destroy(Ticket $ticket)
    {
        $ticket->delete();
        return redirect()->route('tickets.index');
    }
}
