<?php

namespace App\Http\Controllers\Follower;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Publication;

use Illuminate\Http\Request;
use Inertia\Inertia;

class FollowerController extends Controller
{

    public function follow(User $user)
    {
        $follower = auth()->user();
        if ($follower->isFollowing($user)) {
            return redirect()->back();
        }
        $follower->follow($user);

        return redirect()->back();
    }

    public function unfollow(User $user)
    {
        auth()->user()->unfollow($user);

        return redirect()->back();
    }

    public function getFollowers(User $user)
    {
        // $followers = $user->followers()->get();

        // dd($followers);
        // return Inertia::render('Info/Index', [
        //     'followers' => $followers,
        // ]);
    }
}
