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
use App\Events\DcpUpdated;
use App\Models\Dcp;

class DcpController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) 
    {
        abort_unless(auth()->user()->can('dcp_access'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $query = Dcp::query(); 

        if ($request->filled('search')) {
            $query->where('batch', 'like', '%' . $request->search . '%');
        }

        $dcps = $query->latest()->paginate(10); // ✅ paginate from builder

        return Inertia::render('Osds/Dcps/Index', [
            'dcps' => $dcps,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        abort_unless(auth()->user()->can('dcp_create'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        return Inertia::render("Osds/Dcps/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'batch' => ['required', 'string', 'max:255'],
            'year' => ['required', 'numeric'],
            'configuration' => ['required', 'string'],
            'supplier' => ['required', 'string'],
            'remarks' => ['required', 'string'],
            'file' => ['required', 'file', 'max:2048']
        ]);

        $baseSlug = Str::slug($request->batch); 
        $slug = $baseSlug;
        $counter = 1;

        while (Dcp::withTrashed()->where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }

        $file = $request->file('file');
        $filePath = $file->store('dcp', 'public');

        Dcp::create([
            'user_id' => auth()->user()->id,
            'batch' => $request->batch,
            'slug' => $slug,
            'year' => $request->year,
            'configuration' => $request->configuration,
            'remarks' => $request->remarks,
            'file' => $filePath,
            'status' => 0,
        ]);

        return to_route('dcps.index')->with('message', 'DCP batch created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Dcp $dcp)
    {
        abort_unless(auth()->user()->can('dcp_show'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        return Inertia::render('Osds/Dcps/Show', [
            'dcp' => $dcp,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        abort_unless(auth()->user()->can('dcp_edit'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $dcp = Dcp::find($id);

        return Inertia::render("Osds/Dcps/Edit", [
            "dcp" => $dcp,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Dcp $dcp) 
    {
        $request->validate([
            'batch' => ['required', 'string', 'max:255'],
            'year' => ['required', 'numeric'],
            'configuration' => ['required', 'string'],
            'supplier' => ['required', 'string'],
            'remarks' => ['required', 'string'],
            'file' => ['sometimes', 'nullable', 'file', 'max:2048'], // ✅ file is now option
        ]);

        $baseSlug = Str::slug($request->batch); 
        $slug = $baseSlug;
        $counter = 1;

        while (Dcp::withTrashed()->where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }

        $filePath = $dcp->file;

        if ($request->hasFile('file')) {
            // Delete old file
            if ($dcp->file && Storage::disk('public')->exists($dcp->file)) {
                Storage::disk('public')->delete($dcp->file);
            }

            // Store new file
            $file = $request->file('file');
            $filePath = $file->store('dcp', 'public');
        }

        $dcp->update([
            'user_id' => auth()->user()->id,
            'batch' => $request->batch,
            'slug' => $slug,
            'year' => $request->year,
            'configuration' => $request->configuration,
            'supplier' => $request->supplier,
            'remarks' => $request->remarks,
            'file' => $filePath,
        ]);

        broadcast(new DcpUpdated($dcp))->toOthers();

        return to_route('dcps.index')->with('message', 'DCP batch updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dcp $dcp) 
    {
        abort_unless(auth()->user()->can('dcp_delete'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        if ($dcp->file && Storage::disk('public')->exists($dcp->file)) {
            Storage::disk('public')->delete($dcp->file);
        }

        $dcp->delete();

        return to_route("dcps.index")->with('message', 'DCP batch deleted successfully.');
    }
}
