<?php

namespace App\Http\Controllers\Follower;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FollowerController extends Controller
{
    public function index (User $user)
    {
       $followers = $user->followers();
   

       return Inertia::render('Publication/Index', [
           'followers' => $followers,
       ]);
    }
    public function show(User $user)
    {
     
    }
    public function getFollowers(User $user)
    {
        $followers = $user->followers;
        return response()->json([
            'followers' => $followers,
        ]);
    }
    public function follow(User $user)
    {
        auth()->user()->follow($user);

        return redirect()->back();
    }

    public function unfollow(User $user)
    {
        auth()->user()->unfollow($user);

        return redirect()->back();
    }
}
