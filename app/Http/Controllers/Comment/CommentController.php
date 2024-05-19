<?php

namespace App\Http\Controllers\Comment;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\LikeComment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    //

    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            'publication_id' => 'required|integer|exists:publications,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048' // Validación de la imagen
        ]);
    
        $comment = new Comment();
        $comment->content = $request->content;
        $comment->publication_id = $request->publication_id;
        $comment->user_id = auth()->id();
    
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('comments', 'public');
            $comment->image = $imagePath; // Asume que tienes una columna 'image' en tu tabla 'comments'
        }
    
        $comment->save();

        return redirect()->back();
    }


    public function like (Request $request,Comment $comment)
    {
       $user = auth()->user();
       // dd($user);
       $comment = Comment::find($comment->id);
       // dd($comment);
       if($comment->likePublications()->where('user_id',$user->id)->exists()){
           // return redirect(route('publications.index'));
           return to_route('publications.index');
       }

       $like = new LikeComment();
       $like->user_id = $user->id;
       $like->comment_id = $comment->id;
       $like->save();

       $comment->increment('likes');
       return redirect(route('publications.index'));
//      return to_route('publications.index');
    //    return back();



    }


    public function unlike (Comment $comment): RedirectResponse
    {
        $user = auth()->user();
        $comment = Comment::find($comment->id);
        $like = $comment->likePublications()->where('user_id',$user->id)->first();
        $like->delete();
        $comment->decrement('likes');
        return redirect(route('publications.index'));
    }
}
