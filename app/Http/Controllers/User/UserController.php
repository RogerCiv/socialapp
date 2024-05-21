<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Follower;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{

    public function follow(User $user)
    {
        $follower = auth()->user();
        if ($follower->isFollowing($user)) {
            return redirect()->back();
        }
        $follower->follow($user);

        return back()->with('success', 'You are now following ' . $user->name);
    }

    public function unfollow(User $user)
    {
        auth()->user()->unfollow($user);

        return redirect()->back();
    }
    public function followedUsers()
    {
        $user = auth()->user();
        $followedUsers = Follower::where('user_id', $user->id)->get();
        dd($followedUsers);
        return inertia('Edit', ['followedUsers' => $followedUsers]);
    }
}

