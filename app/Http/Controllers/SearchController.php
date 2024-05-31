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
        $user = Auth::user();
        if (!$search)
            return redirect(route('dashboard'));

        $users = User::query()
            ->where('name', 'like', "%$search%")
            ->latest()
            ->get();


//        $publications = Publication::query()
//            ->where('content', 'like', "%$search%")
//            ->paginate(20);

        $publications = Publication::with([
            'user:id,name,avatar',
            'comments' => function ($query) {
                $query->with('user:id,name,avatar')
                    ->with('likes:id');
            },
            'likes:id',
        ])
            ->where('content', 'like', "%{$search}%")
            ->latest()
            ->get();

        if ($request->wantsJson()) {
            return $publications;
        }

        return inertia('Search', [
            'publications' => $publications,
            'search' => $search,
            'users' => UserResource::collection($users),
            'user' => new UserResource($user),
        ]);
    }
//    public function search(Request $request, string $search = null)
//    {
//        if (!$search) {
//            return redirect(route('dashboard'));
//        }
//
//        $users = User::query()
//            ->where('name', 'like', "%$search%")
//            ->latest()
//            ->get();
//
////        $publications = Publication::with([
////            'user:id,name,avatar',
////            'comments' => function ($query) {
////                $query->with('user:id,name,avatar')
////                    ->with('likes:id');
////            },
////            'likes:id',
////        ])
////            ->where('content', 'like', "%{$search}%")
////            ->latest()
////            ->paginate(20);
//
//        $publications = Publication::with([
//            'user:id,name,avatar',
//            'comments' => function ($query) {
//                $query->with('user:id,name,avatar')
//                    ->with('likes:id');
//            },
//            'likes:id',
//        ])
//            ->where('content', 'like', "%{$search}%")
//            ->latest()
//            ->paginate(20);
//
//        $authUser = Auth::user();
////        dd($publications);
////        dd(PublicationResource::collection($publications));
//        return inertia('Search', [
//            'initialPublications' => PublicationResource::collection($publications),
//            'initialUsers' => UserResource::collection($users),
//            'auth' => ['user' => new UserResource($authUser)],
//            'search' => $search,
//        ]);
//    }

}
