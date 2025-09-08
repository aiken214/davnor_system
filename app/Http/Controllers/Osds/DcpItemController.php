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
use App\Events\DcpItemUpdated;
use App\Models\Dcp;
use App\Models\DcpItem;

class DcpItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Dcp $dcp)
    {
        abort_unless(auth()->user()->can('dcp_item_access'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $query = DcpItem::query('dcp_id', $dcp->id); 

        if ($request->filled('search')) {
            $query->where('description', 'like', '%' . $request->search . '%');
        }

        $dcp_items = $query->latest()->paginate(10); 

        return Inertia::render('Osds/DcpItems/Index', [
            'dcp' => $dcp,
            'dcp_items' => $dcp_items,
        ]);
    }
    
    /**
     * Show the form for creating a new resource.
     */
    public function create(Dcp $dcp)
    {
        abort_unless(auth()->user()->can('dcp_item_create'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        return Inertia::render("Osds/DcpItems/Create", [
            'dcp' => $dcp,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'dcp_id' => 'required|exists:dcps,id',
            'description' => 'required|string|max:255',
            'quantity' => 'required|numeric|min:1',
        ]);

        DcpItem::create($validated);

        return redirect()->route('dcp-items.index', $request->dcp_id)->with('message', 'DCP item created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        abort_unless(auth()->user()->can('dcp_item_show'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $dcp_item = DcpItem::findOrFail($id);
  
        return Inertia::render('Osds/DcpItems/Show', [
            'dcp_item' => $dcp_item,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Dcp $dcp, DcpItem $dcp_item)
    {
        abort_unless(auth()->user()->can('dcp_item_edit'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.'); 

        return Inertia::render('Osds/DcpItems/Edit', [
            'dcp' => $dcp,
            'dcp_item' => $dcp_item,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DcpItem $dcp_item)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'quantity' => 'required|numeric|min:1',
        ]);

        $dcp_item->update($validated);

        return redirect()->route('dcp-items.index', $dcp_item->dcp_id)->with('success', 'DCP Item updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DcpItem $dcp_item)
    {
        abort_unless(auth()->user()->can('dcp_item_delete'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $dcp_item->delete();

        return to_route("dcp-items.index", $dcp_item->dcp_id)->with('message', 'DCP item deleted successfully.');
    }
}
