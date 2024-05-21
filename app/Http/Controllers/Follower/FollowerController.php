<?php

namespace App\Http\Controllers\Follower;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Publication;

use Illuminate\Http\Request;
use Inertia\Inertia;

class FollowerController extends Controller
{



    public function getFollowers(User $user)
    {
        // $followers = $user->followers()->get();

        // dd($followers);
        // return Inertia::render('Info/Index', [
        //     'followers' => $followers,
        // ]);
    }
}
