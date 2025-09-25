<?php

namespace App\Http\Controllers\Sgod;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use App\Models\SbmChecklist; 
use App\Models\SbmIndicator; 
use App\Models\SbmResponse; 

class SbmChecklistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        abort_unless(auth()->user()->can('sbm_checklist_access'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $sbm_checklists = SbmChecklist::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where('title', 'like', '%' . $request->search . '%');
            })
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(10);

        return Inertia::render('Sgod/SbmChecklists/Index', [
            'sbm_checklists' => $sbm_checklists,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        abort_unless(auth()->user()->can('sbm_checklist_create'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        return Inertia::render("Sgod/SbmChecklists/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "title" => ['required', 'string'],
            "school_year" => ['required', 'string']
        ]);

        $sbm_checklists = SbmChecklist::create([
            "user_id" => auth()->user()->id,
            "title" => $request->title,
            "school_year" => $request->school_year,
        ]);

        return to_route("sbm-responses.create", ['sbm_checklist_id' => $sbm_checklists->id])->with('message', 'SBM Checklist created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(SbmChecklist $sbm_checklist)
    {
        abort_unless(auth()->user()->can('sbm_checklist_show'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        return Inertia::render('Sgod/SbmChecklists/Show', [
            'sbm_checklist' => $sbm_checklist,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SbmChecklist $sbm_checklist)
    {
        abort_unless(auth()->user()->can('sbm_checklist_edit'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        return Inertia::render('Sgod/SbmChecklists/Edit', [
            'sbm_checklist' => $sbm_checklist,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SbmChecklist $sbm_checklist)
    {
        $request->validate([
            "title" => 'required', 'string', 'max:255',
            "school_year" => 'required', 'string', 'max:255'
        ]);

        $sbm_checklist->title = $request->title;
        $sbm_checklist->school_year = $request->school_year;
        $sbm_checklist->save();

        return to_route("sbm-responses.editResponse", ['sbm_checklist' => $sbm_checklist->id])->with('message', 'SBM Checklist updated successfully.');
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        abort_unless(auth()->user()->can('sbm_checklist_delete'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        SbmChecklist::destroy($id);

        return to_route("sbm-checklists.index");
    }

    public function approve(Request $request, $id)
    {
        abort_unless(auth()->user()->can('sbm_checklist_approve'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $request->validate([
            'status' => 'required|in:approved,disapproved',
            'remarks' => ['nullable', 'string'],
        ]);

        $sbm_checklist = SbmChecklist::findOrFail($id);
            if($request->status == 'approved') {
                $sbm_checklist->status = '1';
            } else {
                $sbm_checklist->status = '2';
            }
        $sbm_checklist->remarks = $request->remarks ?? ''; // Ensure remarks is set, default to empty string if not provided
        $sbm_checklist->save();

        return redirect()->back()->with('message', "SBM Checklist has been {$request->status}.");
    }

    public function print($id)
    {

        abort_unless(auth()->user()->can('sbm_checklist_access'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $sbm_checklist = SbmChecklist::findOrFail($id);
        $indicators = SbmIndicator::all();

        // Fetch existing responses for this checklist
        $responses = SbmResponse::where('sbm_checklist_id', $sbm_checklist->id)
                    ->get()
                    ->values(); 

        return Inertia::render('Sgod/SbmChecklists/Print', [
            'sbm_checklist' => $sbm_checklist,
            'sbmChecklistId' => $sbm_checklist->id,
            'indicators' => $indicators,
            'responses' => $responses,
        ]);

    }
}
