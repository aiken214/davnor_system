<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Division;

class DivisionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) 
    {
        abort_unless(auth()->user()->can('division_access'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $query = Division::query(); 

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $divisions = $query->latest()->paginate(10); // ✅ paginate from builder

        return Inertia::render('Divisions/Index', [
            'divisions' => $divisions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        abort_unless(auth()->user()->can('division_create'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        return Inertia::render("Divisions/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "name" => ['required', 'string', 'max:255'],
        ]);

        $division = Division::create([
            "name" => $request->name,
        ]);

        return to_route("divisions.index")->with('message', 'Division created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        abort_unless(auth()->user()->can('division_show'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $division = Division::find($id);

            return Inertia::render('Divisions/Show', [
            'division' => $division,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        abort_unless(auth()->user()->can('division_edit'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $division = Division::find($id);

        return Inertia::render("Divisions/Edit", [
            "division" => $division,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            "name" => 'required', 'string', 'max:255'
        ]);

        $division = Division::find($id);

        $division->name = $request->name;
        $division->save();

        return to_route("divisions.index")->with('message', 'Division updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        abort_unless(auth()->user()->can('division_delete'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        Division::destroy($id);

        return to_route("divisions.index")->with('message', 'Division deleted successfully.');
    }
}
