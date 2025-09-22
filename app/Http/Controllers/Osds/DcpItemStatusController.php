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
use App\Events\DcpItemStatusUpdated;
use App\Models\DcpItemStatus;
use App\Models\DcpItem;
use App\Models\DcpRecipient;

class DcpItemStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, DcpRecipient $dcp_recipient)
    {
        abort_unless(auth()->user()->can('dcp_item_status_access'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $query = DcpItemStatus::with(['dcp_item'])->where('dcp_recipient_id', $dcp_recipient->id);

        if ($request->filled('search')) {
            $query->whereHas('dcp_item', fn ($q) =>
                $q->where('description', 'like', '%' . $request->search . '%')
            );
        }

        $dcp_item_statuses = $query->latest()->paginate(10);

        return Inertia::render('Osds/DcpItemStatus/Index', [
            'dcp_recipient' => $dcp_recipient,
            'dcp_item_statuses' => $dcp_item_statuses,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(DcpRecipient $dcp_recipient)
    {
        abort_unless(auth()->user()->can('dcp_item_status_create'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');
        
        // Get all item IDs that already have a status for this recipient
         $alreadySubmittedItemIds = DcpItemStatus::where('dcp_recipient_id', $dcp_recipient->id)
            ->pluck('dcp_item_id');

        // Fetch only the DCP items NOT already submitted
        $dcp_items = DcpItem::where('dcp_id', $dcp_recipient->dcp_id)
            ->whereNotIn('id', $alreadySubmittedItemIds)
            ->get();

        return inertia('Osds/DcpItemStatus/Create', [
            'dcp_items' => $dcp_items,
            'dcp_recipient' => $dcp_recipient,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'dcp_recipient_id' => 'required|exists:dcp_recipients,id',
            'responses' => 'required|array',
            'responses.*.dcp_item_id' => 'required|exists:dcp_items,id',
            'responses.*.working' => 'nullable|integer|min:0',
            'responses.*.repairable' => 'nullable|integer|min:0',
            'responses.*.replacement' => 'nullable|integer|min:0',
            'responses.*.unrepairable' => 'nullable|integer|min:0',
            'responses.*.stolen' => 'nullable|string',
            'responses.*.remarks' => 'nullable|string',
        ]);

        foreach ($validated['responses'] as $response) {
            DcpItemStatus::create([
                'dcp_recipient_id' => $validated['dcp_recipient_id'],
                'dcp_item_id' => $response['dcp_item_id'],
                'working' => $response['working'] ?? 0,
                'repairable' => $response['repairable'] ?? 0,
                'replacement' => $response['replacement'] ?? 0,
                'unrepairable' => $response['unrepairable'] ?? 0,
                'stolen' => $response['stolen'] ?? '',
                'remarks' => $response['remarks'] ?? '',
            ]);
        }

        return redirect()
            ->route('dcp-item-status.index2', $validated['dcp_recipient_id'])
            ->with('success', 'DCP item status saved successfully.');
    }    

    /**
     * Display the specified resource.
     */
    public function show(DcpItemStatus $dcp_item_status)
    {
        abort_unless(auth()->user()->can('dcp_item_status_show'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $dcp_item_status->load(['dcp_item', 'dcp_recipient']);

        return inertia('Osds/DcpItemStatus/Show', [
            'dcp_item_status' => $dcp_item_status,
        ]);

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DcpItemStatus $dcp_item_status)
    {
        abort_unless(auth()->user()->can('dcp_item_status_edit'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');
 
        $dcp_item_status->load(['dcp_item', 'dcp_recipient']);

        return inertia('Osds/DcpItemStatus/Edit', [
            'dcp_item_status' => $dcp_item_status,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DcpItemStatus $dcp_item_status)
    {
        
       $validated = $request->validate([
            'working' => 'required|integer|min:0',
            'repairable' => 'required|integer|min:0',
            'replacement' => 'required|integer|min:0',
            'unrepairable' => 'required|integer|min:0',
            'stolen' => 'nullable|string',
            'remarks' => 'nullable|string',
        ]);
        $validated['dcp_recipient_id'] = $dcp_item_status->dcp_recipient_id;
        $validated['dcp_item_id'] = $dcp_item_status->dcp_item_id;

        $dcp_item_status->update($validated);

         return redirect()
            ->route('dcp-item-status.index2', $validated['dcp_recipient_id'])
            ->with('success', 'DCP item status updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DcpItemStatus $dcp_item_status)
    {
        abort_unless(auth()->user()->can('dcp_item_status_delete'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');
        
        $dcp_item_status->delete();

        return redirect()
            ->route('dcp-item-status.index2', $dcp_item_status->dcp_recipient_id)
            ->with('success', 'DCP item status deleted successfully.');
    }
}
