<?php

namespace App\Http\Controllers\Sgod;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use App\Models\SbmChecklist; 
use App\Models\SbmIndicator; 
use App\Models\SbmResponse;

class SbmResponseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        abort_unless(auth()->user()->can('sbm_response_create'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $sbmChecklistId = $request->query('sbm_checklist_id');
        $indicators = SbmIndicator::all();

        return inertia('Sgod/SbmResponses/Create', [
            'indicators' => $indicators,
            'sbmChecklistId' => $sbmChecklistId,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'sbm_checklist_id' => ['required', 'exists:sbm_checklists,id'],
            'responses' => ['required', 'array'],
            'responses.*.indicator_id' => ['required', 'exists:sbm_indicators,id'],
            'responses.*.status' => ['required', 'in:Not yet manifested,Rarely manifested,Frequently manifested,Always manifested'],
            'responses.*.remarks' => ['nullable', 'string'],
        ]);

        foreach ($request->responses as $response) {
            $res = new SbmResponse();
            $res->user_id = auth()->id();
            $res->sbm_checklist_id = $request->sbm_checklist_id;
            $res->indicator_id = $response['indicator_id'];
            $res->status = $response['status'];
            $res->remarks = $response['remarks'];
            $res->save();
        }

        return to_route('sbm-checklists.index')->with('message', 'SBM responses saved successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function editResponse(SbmChecklist $sbm_checklist)
    {
        abort_unless(auth()->user()->can('sbm_response_edit'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.'); 

        $indicators = SbmIndicator::all();

        // Fetch existing responses for this checklist
        $responses = SbmResponse::where('sbm_checklist_id', $sbm_checklist->id)
                    ->get()
                    ->values();

        return inertia('Sgod/SbmResponses/Edit', [
            'sbmChecklistId' => $sbm_checklist->id,
            'indicators' => $indicators,
            'responses' => $responses, // Sent as keyed object
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SbmChecklist $sbm_checklist)
    {
        $request->validate([
            'responses' => ['required', 'array'],
            'responses.*.indicator_id' => ['required', 'exists:sbm_indicators,id'],
            'responses.*.status' => ['required', 'in:Not yet manifested,Rarely manifested,Frequently manifested,Always manifested'],
            'responses.*.remarks' => ['nullable', 'string'],
        ]);
        
        foreach ($request->responses as $response) {
            SbmResponse::updateOrCreate(
                [
                    'sbm_checklist_id' =>$request->sbm_checklist_id,
                    'indicator_id' => $response['indicator_id'],
                    'user_id' => auth()->id(),
                ],
                [
                    'status' => $response['status'],
                    'remarks' => $response['remarks'],
                ]
            );
        }


        return to_route('sbm-checklists.index')->with('message', 'SBM responses updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
