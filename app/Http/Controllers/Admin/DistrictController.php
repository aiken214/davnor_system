<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Division;
use App\Models\District;

class DistrictController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) 
    {
        abort_unless(auth()->user()->can('district_access'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $districts = District::with('division') 
            ->when($request->search, fn ($query, $search) =>
                $query->where('name', 'like', "%{$search}%")
            )
            ->paginate(10)
            ->withQueryString();

        $divisions = Division::select('id', 'name')->get();

        return Inertia::render('Districts/Index', [
            'districts' => $districts,
            'divisions' => $divisions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        abort_unless(auth()->user()->can('district_create'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        return Inertia::render('Districts/Create', [
            'divisions' => Division::select('id', 'name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'division_id' => ['required', 'exists:divisions,id'],
        ]);

        District::create([
            'name' => $request->name,
            'division_id' => $request->division_id,
        ]);

        return to_route('districts.index')->with('message', 'District created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(District $district)
    {
        abort_unless(auth()->user()->can('district_show'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $district->load('division');

        return Inertia::render('Districts/Show', [
            'district' => $district,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(District $district)
    {
        abort_unless(auth()->user()->can('district_edit'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $divisions = Division::select('id', 'name')->get();

        return Inertia::render('Districts/Edit', [
            'district' => $district,
            'divisions' => $divisions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, District $district)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'division_id' => ['required', 'exists:divisions,id'],
        ]);

        $district->update($validated);

        return redirect()->route('districts.index')->with('message', 'District updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        abort_unless(auth()->user()->can('district_delete'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        District::destroy($id);

        return to_route("districts.index")->with('message', 'District deleted successfully.');
    }
}
