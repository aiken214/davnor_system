<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;
use App\Imports\UsersImport;
use Maatwebsite\Excel\Facades\Excel;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) {

        $query = User::with('roles'); // ⬅ eager load roles immediately

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $users = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        abort_unless(auth()->user()->can('user_create'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        return Inertia::render("Users/Create", [
            "roles" => Role::pluck("name")
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {        
        $request->validate([
            "name" => "required",
            "email" => "required",
            "password" => "required"
        ]);

        $user = User::create(
            $request->only(["name", "email"])
            +
            ["password" => Hash::make($request->password)]
        );

        $user->syncRoles($request->roles);

        return to_route("users.index")->with('message', 'User created successfully.');
        
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::with('roles')->findOrFail($id); // ✅ get the actual user

        return Inertia::render("Users/Show", [
            "user" => $user,
            "roles" => $user->roles->pluck("name") // ✅ access roles from the model instance
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        abort_unless(auth()->user()->can('user_edit'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $user = User::find($id);

        return Inertia::render("Users/Edit",  [
            "user" => $user,
            "userRoles" => $user->roles()->pluck("name"),
            "roles" => Role::pluck("name")
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            "name" => "required",
            "email" => "required"
        ]);

        $user = User::find($id);

        $user->name = $request->name;
        $user->email = $request->email;

        if($request->password) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        $user->syncRoles($request->roles);

        return to_route("users.index")->with('message', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        abort_unless(auth()->user()->can('user_delete'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        User::destroy($id);

        return to_route("users.index");
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
        ]);

        Excel::import(new UsersImport, $request->file('file'));

        return back()->with('success', 'Users imported successfully!');
    }
}
