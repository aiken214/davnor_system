<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Events\RolesUpdated;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {       
        $query = Role::with('permissions'); // eager load permissions

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $roles = $query->latest()->paginate(10);

        return Inertia::render("Roles/Index", [
            "roles" => $roles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("Roles/Create", [
            "permissions" => Permission::pluck("name")
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "name" => "required",
            "permissions" => "required"
        ]);

        $role = Role::create(["name" => $request->name]);

        $role->syncPermissions($request->permissions);

        return to_route("roles.index")->with('message', 'Role created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $role = Role::find($id);

        return Inertia::render("Roles/Show", [
            "role" => $role,
            "permissions" => $role->permissions()->pluck("name")
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $role = Role::find($id);

        return Inertia::render("Roles/Edit", [
            "role" => $role,
            "rolePermissions" => $role->permissions()->pluck("name"),
            "permissions" => Permission::pluck("name")
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            "name" => "required",
            "permissions" => "required"
        ]);

        $role = Role::find($id);

        $role->name = $request->name;
        $role->save();

        $role->syncPermissions($request->permissions);

        broadcast(new RolesUpdated($role))->toOthers();

        return to_route("roles.index")->with('message', 'Permission updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Role::destroy($id);

        return to_route("roles.index");
    }
}
