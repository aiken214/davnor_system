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
use App\Models\TicketAttachment;

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
            'file' => ['sometimes', 'nullable', 'file', 'max:2048'],
        ]);

        $ticket = Ticket::create([
            'user_id' => auth()->id(),
            'category_id' => $request->category_id,
            'subject' => $request->subject,
            'description' => $request->description,
            'priority' => $request->priority,
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');

            // Create unique slug based on original file name
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $baseSlug = Str::slug($originalName);
            $slug = $baseSlug;
            $counter = 1;

            while (TicketAttachment::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter++;
            }

            $file = $request->file('file');
            $filePath = $file->store('ticket_attachment', 'public');

            $ticketAttachment = TicketAttachment::create([
                'ticket_id' => $ticket->id,
                'slug' => $slug,
                'file_path' => $filePath,
                'file_name' => $file->getClientOriginalName(),
                'uploaded_by' => auth()->id(),
            ]);
        }
        
        return to_route('tickets.index')->with('message', 'DCP batch created successfully.');
    }

    public function show(Ticket $ticket)
    {
        abort_unless(auth()->user()->can('ticket_show'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $ticket->load(['comments.user', 'attachments', 'logs', 'category', 'user', 'assignedTo']);

        return Inertia::render('Osds/IctTickets/Show', [
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
            'category_id' => 'required|exists:ticket_categories,id',
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high,urgent',
            'file_path' => ['sometimes', 'nullable', 'file', 'max:2048'],
        ]);

        // Update ticket fields
        $ticket->update([
            'category_id' => $request->category_id,
            'subject' => $request->subject,
            'description' => $request->description,
            'priority' => $request->priority,
        ]);

        if ($request->hasFile('file_path')) {
            $file = $request->file('file_path');

            // Create unique slug based on original file name
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $baseSlug = Str::slug($originalName);
            $slug = $baseSlug;
            $counter = 1;

            while (TicketAttachment::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter++;
            }

            // Store file
            $filePath = $file->store('ticket_attachment', 'public');

            // Get existing attachment
            $attachment = TicketAttachment::where('id', $request->attachment_id)->first();

            // Delete old file from disk (not DB)
            if ($attachment?->file_path && Storage::disk('public')->exists($attachment?->file_path)) {
                Storage::disk('public')->delete($attachment->file_path);

                // Update existing DB record
                $attachment->update([
                    'ticket_id' => $ticket->id,
                    'slug' => $slug,
                    'file_path' => $filePath,
                    'file_name' => $file->getClientOriginalName(),
                    'uploaded_by' => auth()->id(),
                ]);
            } else {
                // Create new attachment if no existing one
                TicketAttachment::create([
                    'ticket_id' => $ticket->id,
                    'slug' => $slug,
                    'file_path' => $filePath,
                    'file_name' => $file->getClientOriginalName(),
                    'uploaded_by' => auth()->id(),
                ]);
            }         
        }

        return to_route('tickets.index')->with('message', 'Ticket updated successfully.');
    }

    public function destroy(Ticket $ticket)
    {
        abort_unless(auth()->user()->can('ticket_delete'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');
        
        if ($ticket->file && Storage::disk('public')->exists($ticket->file)) {
            Storage::disk('public')->delete($ticket->file);
        }

        $ticket->delete();
        
        return redirect()->route('tickets.index')->with('message', 'Ticket deleted successfully.');
    }
}
