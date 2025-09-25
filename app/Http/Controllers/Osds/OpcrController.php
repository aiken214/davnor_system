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
use App\Events\OpcrUpdated;
use App\Models\Opcr;

class OpcrController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) 
    {

        $opcrs = Opcr::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where('title', 'like', '%' . $request->search . '%');
            })
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(10);

        return Inertia::render('Osds/Opcrs/Index', [
            'opcrs' => $opcrs,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        abort_unless(auth()->user()->can('opcr_create'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        return Inertia::render("Osds/Opcrs/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'period' => ['required', 'string'],
            'rating' => ['required', 'numeric'],
            'rater' => ['required', 'string'],
            'file' => ['required', 'file', 'max:2048']
        ]);

        $baseSlug = Str::slug($request->title); 
        $slug = $baseSlug;
        $counter = 1;

        while (Opcr::withTrashed()->where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }

        $file = $request->file('file');
        $filePath = $file->store('opcrs', 'public');

        Opcr::create([
            'user_id' => auth()->user()->id,
            'title' => $request->title,
            'slug' => $slug,
            'period' => $request->period,
            'rating' => $request->rating,
            'rater' => $request->rater,
            'file' => $filePath,
            'status' => 0,
        ]);

        return to_route('opcrs.index')->with('message', 'OPCR created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $opcr = Opcr::find($id);

        return Inertia::render('Osds/Opcrs/Show', [
            'opcr' => $opcr,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        abort_unless(auth()->user()->can('opcr_edit'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $opcr = Opcr::find($id);

        return Inertia::render("Osds/Opcrs/Edit", [
            "opcr" => $opcr,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Opcr $opcr) 
    {
        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'period' => ['required', 'string'],
            'rating' => ['required', 'numeric'],
            'rater' => ['required', 'string'],
            'file' => ['sometimes', 'nullable', 'file', 'max:2048'], // ✅ file is now optional
        ]);

        $baseSlug = Str::slug($request->title); 
        $slug = $baseSlug;
        $counter = 1;

        while (Opcr::withTrashed()->where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }

        $filePath = $opcr->file;

        if ($request->hasFile('file')) {
            // Delete old file
            if ($opcr->file && Storage::disk('public')->exists($opcr->file)) {
                Storage::disk('public')->delete($opcr->file);
            }

            // Store new file
            $file = $request->file('file');
            $filePath = $file->store('opcrs', 'public');
        }

        $opcr->update([
            'user_id' => auth()->user()->id,
            'title' => $request->title,
            'slug' => $slug,
            'period' => $request->period,
            'rating' => $request->rating,
            'rater' => $request->rater,
            'file' => $filePath,
        ]);

        broadcast(new OpcrUpdated($opcr))->toOthers();

        return to_route('opcrs.index')->with('message', 'OPCR updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Opcr $opcr) 
    {
        abort_unless(auth()->user()->can('opcr_delete'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        if ($opcr->file && Storage::disk('public')->exists($opcr->file)) {
            Storage::disk('public')->delete($opcr->file);
        }

        $opcr->delete();

        return to_route("opcrs.index")->with('message', 'OPCR deleted successfully.');
    }

    public function approve(Request $request, $id)
    {
        abort_unless(auth()->user()->can('opcr_approve'), Response::HTTP_FORBIDDEN, 'User does not have the right permissions.');

        $request->validate([
            'status' => 'required|in:approved,disapproved',
            'remarks' => ['nullable', 'string'],
        ]);

        $opcr = Opcr::findOrFail($id);
            if($request->status == 'approved') {
                $opcr->status = '1';
            } else {
                $opcr->status = '2';
            }
        $opcr->remarks = $request->remarks ?? ''; // Ensure remarks is set, default to empty string if not provided
        $opcr->save();

        return redirect()->back()->with('message', "OPCR has been {$request->status}.");
    }

}
