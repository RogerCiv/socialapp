<?php

namespace App\Http\Controllers;

use App\Http\Resources\PublicationResource;
use App\Http\Resources\UserResource;
use App\Models\Publication;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SearchController extends Controller
{
    public function search(Request $request, string $search = null)
    {
        if (!$search)
            return redirect(route('dashboard'));

        $users = User::query()
            ->where('name', 'like', "%$search%")
            ->latest()
            ->get();


        $publications = Publication::query()
            ->where('content', 'like', "%$search%")
            ->paginate(20);


        if ($request->wantsJson()) {
            return $publications;
        }

//    dd($publications->items());
        return inertia('Search', [
            'publications' => $publications->items(),
            'search' => $search,
            'users' => UserResource::collection($users),
        ]);
    }
}