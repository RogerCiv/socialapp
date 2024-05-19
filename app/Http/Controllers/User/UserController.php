<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Follower;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function followedUsers()
    {
        $user = auth()->user();
        $followedUsers = Follower::where('user_id', $user->id)->get();
        dd($followedUsers);
        return inertia('Edit', ['followedUsers' => $followedUsers]);
    }
}

