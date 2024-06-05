<?php
namespace App\Http\Controllers\LikePublication;

use App\Http\Controllers\Controller;
use App\Models\LikePublication;
use App\Models\Publication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;


class LikePublicationController extends Controller
{
        public function like (Request $request,Publication $publication)
        {
           $user = auth()->user();
           $publication = Publication::find($publication->id);

           if($publication->likePublications()->where('user_id',$user->id)->exists()){
               return to_route('publications.index');
           }
           $like = new LikePublication();
           $like->user_id = $user->id;
           $like->publication_id = $publication->id;
           $like->save();

           $publication->increment('likes');
            return back()->with('success', "You liked the publication!");
        }

        public function unlike (Publication $publication): RedirectResponse
        {
            $user = auth()->user();
            $publication = Publication::find($publication->id);
            $like = $publication->likePublications()->where('user_id',$user->id)->first();
            $like->delete();
            $publication->decrement('likes');
            return back()->with('success', "You unliked the publication!");

        }




}
