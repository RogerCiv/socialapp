<?php
namespace App\Http\Controllers\LikePublication;

use App\Http\Controllers\Controller;
use App\Models\LikePublication;
use App\Models\Publication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;


class LikePublicationController extends Controller
{
    // public function getLikes(Publication $publication)
    // {
    //     $user = auth()->user();
    //     $likePublication = $publication->likePublications()->where('user_id', $user->id)->first();

    //     dd($likePublication);
    //     // return redirect(route('publications.index'));
    //     return response()->json([
    //         'likes' => $publication->likes,
    //         'liked' => $likePublication ? true : false,
    //     ]);
    // }

        public function like (Request $request,Publication $publication)
        {
           $user = auth()->user();
           // dd($user);

           $publication = Publication::find($publication->id);
           // dd($publication);
           if($publication->likePublications()->where('user_id',$user->id)->exists()){
               // return redirect(route('publications.index'));
               return to_route('publications.index');
           }

           $like = new LikePublication();
           $like->user_id = $user->id;
           $like->publication_id = $publication->id;
           $like->save();

           $publication->increment('likes');
//           return redirect(route('publications.index'));
    //      return to_route('publications.index');
            return back()->with('success', "You liked the publication!");



        }


        public function unlike (Publication $publication): RedirectResponse
        {
            $user = auth()->user();
            $publication = Publication::find($publication->id);
            $like = $publication->likePublications()->where('user_id',$user->id)->first();
            $like->delete();
            $publication->decrement('likes');
//            return redirect(route('publications.index'));
            return back()->with('success', "You unliked the publication!");

        }




}
