<?php

namespace App\Http\Controllers\Sgod;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use App\Models\SbmIndicator; 

class SbmIndicatorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        abort_unless(auth()->user()->can('sbm_indicator_access'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $query = SbmIndicator::query(); 

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $sbm_indicators = $query->oldest()->paginate(10); // ✅ paginate from builder

        return Inertia::render('Sgod/SbmIndicators/Index', [
            'sbm_indicators' => $sbm_indicators,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        abort_unless(auth()->user()->can('sbm_indicator_create'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        return Inertia::render("Sgod/SbmIndicators/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "description" => ['required', 'string'],
            "area" => ['required', 'string'],
        ]);

        $sbm_indicators = SbmIndicator::create([
            "description" => $request->description,
            "area" => $request->area,
        ]);

        return to_route("sbm-indicators.index")->with('message', 'SBM Indicator created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(SbmIndicator $sbm_indicator)
    {
        abort_unless(auth()->user()->can('sbm_indicator_show'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        return Inertia::render('Sgod/SbmIndicators/Show', [
            'sbm_indicator' => $sbm_indicator,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SbmIndicator $sbm_indicator)
    {
        abort_unless(auth()->user()->can('sbm_indicator_edit'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        return Inertia::render('Sgod/SbmIndicators/Edit', [
            'sbm_indicator' => $sbm_indicator,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SbmIndicator $sbm_indicator)
    {
        $request->validate([
            "description" => 'required', 'string',
            "area" => 'required', 'string',
        ]);

        $sbm_indicator->description = $request->description;
        $sbm_indicator->area = $request->area;
        $sbm_indicator->save();

        return to_route("sbm-indicators.index")->with('message', 'SBM Indicator updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        abort_unless(auth()->user()->can('sbm_indicator_delete'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        SbmIndicator::destroy($id);

        return to_route("sbm-indicators.index");
    }
}
