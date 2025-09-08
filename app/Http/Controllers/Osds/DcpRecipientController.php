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
use App\Events\DcpRecipientUpdated;
use App\Models\DcpRecipient;
use App\Models\Dcp;
use App\Models\School;

class DcpRecipientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Dcp $dcp)
    {
        abort_unless(auth()->user()->can('dcp_recipient_access'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $query = DcpRecipient::with('school')->where('dcp_id', $dcp->id);

        if ($request->filled('search')) {
            $query->whereHas('school', fn ($q) =>
                $q->where('name', 'like', '%' . $request->search . '%')
            );
        }

        $dcp_recipients = $query->latest()->paginate(10);

        return Inertia::render('Osds/DcpRecipients/Index', [
            'dcp' => $dcp,
            'dcp_recipients' => $dcp_recipients,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Dcp $dcp)
    {
        abort_unless(auth()->user()->can('dcp_recipient_create'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        return Inertia::render("Osds/DcpRecipients/Create", [
            'dcp' => $dcp,
            'schools' => School::select('id', 'name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'dcp_id' => 'required|exists:dcps,id',
            'school_id' => ['required', 'exists:schools,id'],
            'allocation' => ['required', 'numeric'],
            'date_delivery' => ['required', 'date'],
            'remarks' => ['required', 'string'],
            'file' => ['required', 'file', 'max:2048']
        ]);

        $school = School::findOrFail($request->school_id);
        $baseSlug = Str::slug($school->name);
        $slug = $baseSlug;
        $counter = 1;

        while (DcpRecipient::withTrashed()->where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }

        $file = $request->file('file');
        $filePath = $file->store('dcp-recipient', 'public');

        DcpRecipient::create([
            'dcp_id' => $request->dcp_id,
            'school_id' => $request->school_id,
            'allocation' => $request->allocation,
            'date_delivery' => $request->date_delivery,
            'slug' => $slug,
            'remarks' => $request->remarks,
            'file' => $filePath,
        ]);

        return redirect()->route('dcp-recipients.index2', $request->dcp_id)->with('message', 'DCP recipient created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        abort_unless(auth()->user()->can('dcp_recipient_show'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $dcp_recipient = DcpRecipient::with('school')->findOrFail($id);
  
        return Inertia::render('Osds/DcpRecipients/Show', [
            'dcp_recipient' => $dcp_recipient,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
     public function edit(DcpRecipient $dcp_recipient)
    {
        abort_unless(auth()->user()->can('dcp_recipient_edit'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.'); 

        $dcp_recipient->load(['school']);

        return Inertia::render('Osds/DcpRecipients/Edit', [
            'dcp_recipient' => $dcp_recipient,
            'schools' => School::select('id', 'name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DcpRecipient $dcp_recipient)
    {
        $request->validate([
            'school_id' => ['required', 'exists:schools,id'],
            'allocation' => ['required', 'numeric'],
            'date_delivery' => ['required', 'date'],
            'remarks' => ['required', 'string'],
            'file' => ['sometimes', 'nullable', 'file', 'max:2048'],
        ]);
      
        $school = School::findOrFail($request->school_id);
        $baseSlug = Str::slug($school->name);
        $slug = $baseSlug;
        $counter = 1;

        while (DcpRecipient::withTrashed()->where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }

        $filePath = $dcp_recipient->file;

        if ($request->hasFile('file')) {
            // Delete old file
            if ($dcp_recipient->file && Storage::disk('public')->exists($dcp_recipient->file)) {
                Storage::disk('public')->delete($dcp_recipient->file);
            }

            // Store new file
            $file = $request->file('file');
            $filePath = $file->store('dcp-recipient', 'public');
        }

        $dcp_recipient->update([
            'dcp_id' => $dcp_recipient->dcp_id,
            'school_id' => $request->school_id,
            'allocation' => $request->allocation,
            'date_delivery' => $request->date_delivery,
            'slug' => $slug,
            'remarks' => $request->remarks,
            'file' => $filePath,
        ]);

        broadcast(new DcpRecipientUpdated($dcp_recipient))->toOthers();

        return redirect()->route('dcp-recipients.index2', $dcp_recipient->dcp_id)->with('message', 'DCP recipient created successfully.');
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DcpRecipient $dcp_recipient)
    {
        abort_unless(auth()->user()->can('dcp_recipient_delete'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');
       
        if ($dcp_recipient->file) {
            Storage::disk('public')->delete($dcp_recipient->file);
        }

        $dcp_recipient->delete();

        return to_route("dcp-recipients.index2", $dcp_recipient->dcp_id)->with('message', 'DCP recipient deleted successfully.');
    }
}
