<?php
namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\Follower;
use App\Models\Publication;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
class ProfileController extends Controller
{
    public function index(User $user)
    {
        $isCurrentUserFollower = false;
        if (!Auth::guest()) {
            $isCurrentUserFollower = Follower::where('user_id', $user->id)->where('follower_id', auth()->id())->exists();
        }

        $followerCount = Follower::where('user_id', $user->id)->count();

        $publications = Publication::where('user_id', $user->id)
            ->with([
                'user:id,name,avatar',
                'comments' => function($query) {
                    $query->with('user:id,name,avatar');
                    $query->with('likes:id');
                },
                'likes:id'
            ])
            ->latest()
            ->get();

        $followingCount = Follower::where('follower_id', $user->id)->count();

//        $followers = User::query()
//            ->select('users.*')
//            ->join('follower_user AS f', 'f.user_id', '=', 'users.id')
//            ->where('f.follower_id', $user->id)
//            ->get();
        $followers = User::query()
            ->select('users.*',
                DB::raw('(SELECT COUNT(*) FROM publications WHERE publications.user_id = users.id) as publications_count'),
                DB::raw('(SELECT COUNT(*) FROM follower_user WHERE follower_user.user_id = users.id) as followers_count')
            )
            ->join('follower_user AS f', 'f.user_id', '=', 'users.id')
            ->where('f.follower_id', $user->id)
            ->get();

        $followings = User::query()
            ->select('users.*')
            ->join('follower_user AS f', 'f.follower_id', '=', 'users.id') // Corregir la condición de unión
            ->where('f.user_id', $user->id) // Filtrar por el id del usuario seguido
            ->get();

        $comments = Publication::with('comments')->where('user_id',$user->id)->get();
        return Inertia::render('Profile/View', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'user' => new UserResource($user),
            'isCurrentUserFollower' => $isCurrentUserFollower,
            'followerCount' => $followerCount,
            'followingCount' => $followingCount,
            'publications' => $publications,
            'followers' => $followers,
            'followings' => UserResource::collection($followings),
            'comments' => $comments,
        ]);
    }

    // public function index()
    // {
    //     // $user = auth()->user();
    //     $user = Auth::user();
    //     $followers = $user->followers()->get();
    //     $publications = Publication::with('user:id,name')->latest()->get();


    //     return Inertia::render('Info/Index');
    // }
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
//    public function update(Request $request): RedirectResponse
//    {
//        dd($request->all());
//        $request->user()->fill($request->validated());
//
//        if ($request->user()->isDirty('email')) {
//            $request->user()->email_verified_at = null;
//        }
//        $request->user()->save();
//
//        return Redirect::route('profile.edit');
//    }

    public function update(Request $request): RedirectResponse
    {
        // dd($request->all()); // Para depuración, puedes dejar esto comentado

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        $user = $request->user();
        $user->fill($validated);

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $path = $request->file('avatar')->store('avatars', ['disk' => 'public']);
            $user->avatar = $path;
        }

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit');
    }


    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
