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
    public function getComments() {
        $user = auth()->user();
        $comments = Comment::with('user', 'likes')->get();
    
        // Agregar información de si el usuario actual ha dado like a cada comentario
        $comments->each(function($comment) use ($user) {
            $comment->user_has_liked = $comment->likes->contains('user_id', $user->id);
        });
        dd($comments);
    
        return view('publications.index', compact('comments'));
    }
    

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

    public function like( $commentId)
    {
        $user = auth()->user();

        $comment = Comment::find($commentId);
        // dd($comment);
        if ($comment->likes()->where('user_id', $user->id)->exists()) {
            return redirect()->back();
        }

        $like = new LikeComment();
        $like->user_id = $user->id;
        $like->comment_id = $comment->id;
        $like->save();
        $comment->increment('likes');
        return redirect()->back();
    }

    public function unlike($commentId): RedirectResponse
    {
        $user = auth()->user();
        $comment = Comment::find($commentId);
        
        
        $like = $comment->likes()->where('user_id', $user->id)->first();
 
        if ($like) {
            $like->delete();
            $comment->decrement('likes');
        }

        return redirect()->back();
    }
    
}
