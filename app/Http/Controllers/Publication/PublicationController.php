<?php

namespace App\Http\Controllers\Publication;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Comment;
use App\Models\Follower;

use App\Models\LikePublication;
use App\Models\Publication;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PublicationController extends Controller
{
    public function index(User $user)
    {
        $isCurrentUserFollower = false;
        if (!Auth::guest()) {
            $isCurrentUserFollower = Follower::where('user_id', $user->id)->where('follower_id', auth()->id())->exists();
        }
        $followerCount = Follower::where('user_id', $user->id)->count();

        $publications = Publication::with([
            'user:id,name,avatar',
            'comments' => function ($query) {
                $query->with('user:id,name,avatar')
                    ->orderBy('created_at', 'desc');
                $query->with('likes:id');
            },
            'likes:id',
        ])->latest()->get();


        $publicationsForUser = Publication::query()
            ->select('publications.*')
            ->leftJoin('follower_user AS f1', 'publications.user_id', '=', 'f1.follower_id')
            ->leftJoin('follower_user AS f2', 'publications.user_id', '=', 'f2.user_id')
            ->join('comments', 'comments.user_id', '=', 'publications.user_id')
            ->where(function ($query) use ($user) {
                $query->where('f1.user_id', $user->id)
                ->orWhere('f2.follower_id', $user->id);
            })
            ->with([
                'user:id,name,avatar',
                'comments' => function ($query) {
                    $query->with('user:id,name,avatar');
                    $query->with('likes:id');
                },
                'likes:id',
            ])
            ->latest()
            ->distinct()
            ->get();


//    dd($publicationsForUser);
        $top3Pub = Publication::select('user_id', DB::raw('count(*) as publications_count'))
            ->groupBy('user_id')
            ->orderByDesc('publications_count')
            ->with('user:id,name,avatar') // Para obtener los detalles del usuario
            ->take(3) // Puedes ajustar el número según lo necesites
            ->get();

        $top3Comments = Comment::select('user_id', DB::raw('count(*) as comments_count'))
            ->groupBy('user_id')
            ->orderByDesc('comments_count')
            ->with('user:id,name,avatar') // Para obtener los detalles del usuario
            ->take(3) // Puedes ajustar el número según lo necesites
            ->get();
        $top3LikedPublications = LikePublication::select('publication_id', DB::raw('count(*) as likes_count'))
            ->groupBy('publication_id')
            ->orderByDesc('likes_count')
            ->with('publication:id,content') // Obtener los detalles de la publicación
            ->take(3) // Puedes ajustar el número según lo necesites
            ->get();



        $followingCount = Follower::where('follower_id', $user->id)->count();
        $followers = $user->followers()->get();
        return Inertia::render('Publications/Index', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'user' => new UserResource($user),
            'isCurrentUserFollower' => $isCurrentUserFollower,
            'followerCount' => $followerCount,
            'followingCount' => $followingCount,
            'publications' => $publications,
            'followers' => $followers,
            'publicationsForUser' => $publicationsForUser,
            'top3Pub' => $top3Pub,
            'top3Comments' => $top3Comments,
            'top3LikedPublications' => $top3LikedPublications,

        ]);
    }


  public function store(Request $request): RedirectResponse
  {
//    dd($request->all());
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
    $userId = auth()->id();
    // return new PublicationResource($publication->load('user', 'likePublications','comments'));
    return inertia('Publications/PublicationShow', [
      'publication' => $publication->load('comments', 'user'), // Carga los comentarios y el usuario de la publicación
  ]);
  }

    public function getMyPublications()
    {
        $user = auth()->user();
        $publicationsByUser = Publication::where('user_id', $user->id)->get();
        $followers = Follower::where('user_id', $user->id)
            ->join('users', 'follower_user.follower_id', '=', 'users.id')
            ->select('follower_user.*', 'users.name as follower_name', 'users.avatar as follower_avatar')
            ->get();
        $top3Pub = Publication::select('user_id', DB::raw('count(*) as publications_count'))
            ->groupBy('user_id')
            ->orderByDesc('publications_count')
            ->with('user:id,name,avatar') // Para obtener los detalles del usuario
            ->take(3) // Puedes ajustar el número según lo necesites
            ->get();
        // dd($publicationsByUser);
        // dd($followers);
        // dd($top3Pub);
        return Inertia::render('Info/Index', [
            'publicationsByUser' =>  $publicationsByUser,
            'followers' => $followers,
            'top3Pub' => $top3Pub,
        ]);
    }

  public function update(Request $request, Publication $publication): RedirectResponse
  {
    //
//     dd($request->all(), $publication);
    Gate::authorize('update', $publication);

    $validated = $request->validate([
      'content' => 'required|string|max:255',
      'image' => 'nullable|image|max:1024',
    ]);
    if($request->hasFile('image')){
      if($publication->image){
        Storage::disk('public')->delete($publication->image);
      }
      $path = $request->file('image')->store('images', ['disk' => 'public']);
      $validated['image'] = $path;
    }

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
