<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) 
    {
        abort_unless(auth()->user()->can('permission_access'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $query = Permission::query(); 

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $permissions = $query->latest()->paginate(10); // ✅ paginate from builder

        return Inertia::render('Permissions/Index', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        abort_unless(auth()->user()->can('permission_create'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        return Inertia::render("Permissions/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "name" => ['required', 'string', 'max:255'],
        ]);

        $permission = Permission::create([
            "name" => $request->name,
            "guard_name" => 'web'
        ]);

        return to_route("permissions.index")->with('message', 'Permission created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $permission = Permission::find($id);

        return Inertia::render('Permissions/Show', [
        'permission' => $permission,
    ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        abort_unless(auth()->user()->can('permission_edit'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $permission = Permission::find($id);

        return Inertia::render("Permissions/Edit", [
            "permission" => $permission,
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

        $permission = Permission::find($id);

        $permission->name = $request->name;
        $permission->save();

        return to_route("permissions.index")->with('message', 'Permission updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Permission::destroy($id);

        return to_route("permissions.index")->with('message', 'Permission deleted successfully.');
    }

}
