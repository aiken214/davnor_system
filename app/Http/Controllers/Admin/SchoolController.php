<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use App\Models\District;
use App\Models\School;

class SchoolController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) 
    {
        abort_unless(auth()->user()->can('school_access'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $schools = School::with('district.division') 
            ->when($request->search, fn ($query, $search) =>
                $query->where('name', 'like', "%{$search}%")
            )
            ->paginate(10)
            ->withQueryString();

        $districts = District::with('division')->select('id', 'name')->get();

        return Inertia::render('Schools/Index', [
            'districts' => $districts,
            'schools' => $schools,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        abort_unless(auth()->user()->can('school_create'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        return Inertia::render('Schools/Create', [
            'districts' => District::with('division')
                        ->whereHas('division') // Only get districts that have divisions
                        ->select('id', 'name', 'division_id')
                        ->orderBy('name')
                        ->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'depedsch_id' => ['required', 'numeric'],
            'address' => ['required', 'string'],
            'contact_number' => ['required', 'numeric'],
            'email' => ['required', 'email'],
            'district_id' => ['required', 'numeric'],
        ]);

        School::create([
            'name' => $request->name,
            'depedsch_id' => $request->depedsch_id,
            'address' => $request->address,
            'contact_number' => $request->contact_number,
            'email' => $request->email,
            'district_id' => $request->district_id,
        ]);

        return to_route('schools.index')->with('message', 'School created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(School $school)
    {
        abort_unless(auth()->user()->can('school_show'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $school->load('district', 'district.division');

        return Inertia::render('Schools/Show', [
            'school' => $school,
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        abort_unless(auth()->user()->can('school_edit'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $school = School::with('district.division')->findOrFail($id);
        
        return Inertia::render('Schools/Edit', [
            'school' => $school,
            'districts' => District::with('division')
                        ->whereHas('division') // Only get districts that have divisions
                        ->select('id', 'name', 'division_id')
                        ->orderBy('name')
                        ->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $school = School::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string',
            'depedsch_id' => 'required|numeric',
            'address' => 'required|string',
            'contact_number' => 'required|numeric',
            'email' => 'required|email',
            'district_id' => 'required|exists:districts,id',
        ]);

        $school->update($validated);

        return redirect()->route('schools.index')->with('message', 'School updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        abort_unless(auth()->user()->can('school_delete'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        School::destroy($id);

        return to_route("schools.index")->with('message', 'School deleted successfully.');
    }
}
