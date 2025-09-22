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
use App\Models\Office;

class TicketCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        abort_unless(auth()->user()->can('ticket_category_access'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $query = TicketCategory::with('office'); 

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $ticket_categories = $query->latest()->paginate(10); 

        return Inertia::render('Osds/TicketCategories/Index', [
            'ticket_categories' => $ticket_categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(TicketCategory $ticket_categories)
    {
        abort_unless(auth()->user()->can('ticket_category_create'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        return Inertia::render("Osds/TicketCategories/Create", [
            'ticket_categories' => $ticket_categories,
            'offices' => Office::select('id', 'name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'office_id' => ['required', 'exists:offices,id'],
        ]);

        TicketCategory::create($validated);

        return redirect()->route('ticket-categories.index')->with('message', 'Ticket category created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(TicketCategory $ticketCategory)
    {
        abort_unless(auth()->user()->can('ticket_category_show'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $ticketCategory->load('office');

        return Inertia::render('Osds/TicketCategories/Show', [
            'ticketCategory' => $ticketCategory,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TicketCategory $ticketCategory)
    {

        abort_unless(auth()->user()->can('ticket_category_edit'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        return Inertia::render('Osds/TicketCategories/Edit', [
            'ticketCategory' => $ticketCategory,
            'offices' => Office::select('id', 'name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TicketCategory $ticketCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'office_id' => 'required|exists:offices,id',
        ]);

        $ticketCategory->update($validated);

        return redirect()->route('ticket-categories.index')
            ->with('success', 'Ticket category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TicketCategory $ticketCategory)
    {
        abort_unless(auth()->user()->can('ticket_category_delete'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $ticketCategory->delete();

        return to_route("ticket-categories.index")->with('message', 'DCP item deleted successfully.');
    }
}
