<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Follower;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function follow(Request $request, User $user)
    {
        $data = $request->validate([
            'follow' => ['boolean']
        ]);
        if ($data['follow'] === true) {
            $message = 'You are now following ' . $user->name;
            Follower::create([
                'user_id' => $user->id,
                'follower_id' => Auth::id(),
            ]);
        } else {
            $message = 'You have unfollowed ' . $user->name;
            Follower::query()->where('user_id', $user->id)
                ->where('follower_id', Auth::id())
                ->delete();
        }

        return back()->with('success', $message);
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

