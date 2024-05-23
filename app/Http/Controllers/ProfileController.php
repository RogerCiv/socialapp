<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Follower\FollowerController;
use App\Http\Requests\ProfileUpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\Follower;
use App\Models\Publication;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(User $user)
    {
        $isCurrentUserFollower = false;
        if (!Auth::guest()) {
            $isCurrentUserFollower = Follower::where('user_id', $user->id)->where('follower_id', auth()->id())->exists();
        }

        $followerCount = Follower::where('user_id', $user->id)->count();
//        $publications = Publication::where('user_id', $user->id)->with('user:id,name,avatar')->latest()->get();
//        $publications = Publication::postsForTimeline(Auth::id());
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
        $followers = $user->followers()->get();
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
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

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
