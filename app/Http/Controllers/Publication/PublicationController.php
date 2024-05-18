<?php

namespace App\Http\Controllers\Publication;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicationResource;
use App\Models\Follower;
use App\Models\LikePublication;
use App\Models\Publication;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicationController extends Controller
{

  public function index()
  {
    $user = auth()->user();

    // $likePublications = LikePublication::where('user_id', $user->id)->get();
    $likePublications = LikePublication::where('like_publications.user_id', $user->id)
    ->join('publications', 'publications.id', '=', 'like_publications.publication_id')
    ->pluck('publications.id')
    ->toArray();
    $followers =Follower::where('user_id', $user->id)->get();
    // dd($followers);
    return Inertia::render('Publications/Index', [
      'publications' => Publication::with('user:id,name')->latest()->get(),
      'likePublications' => $likePublications,
      'followers' => $followers,
    ]);
  }

  public function store(Request $request): RedirectResponse
  {

      $validated = $request->validate([
          'content' => 'required|string|max:255',
          'image' => 'nullable|image|max:1024',
      ]);
      if ($request->hasFile('image')) {
        $path = $request->file('image')->store('images', ['disk' => 'public']);
        $validated['image'] = $path;
    }

      $request->user()->publications()->create($validated);

      return redirect(route('publications.index'));
  }

  public function show(Publication $publication)
  {
      // $userId = auth()->id();
      // return new PublicationResource($publication->load('user', 'likePublications'));
  }

  public function update(Request $request, Publication $publication): RedirectResponse
    {
        //
        Gate::authorize('update', $publication);

        $validated = $request->validate([
            'content' => 'required|string|max:255',
        ]);

        $publication->update($validated);

        return redirect(route('publications.index'));
    }

    public function destroy(Publication $publication): RedirectResponse
    {
        //
        Gate::authorize('delete', $publication);

        $publication->delete();

        return redirect(route('publications.index'));
    }
}
