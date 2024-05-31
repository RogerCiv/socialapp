<?php

namespace App\Http\Controllers\Comment;

use App\Http\Controllers\Controller;
use App\Http\Requests\CommentRequest;
use App\Models\Comment;
use App\Models\LikeComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;

use Illuminate\Support\Facades\Storage;

class CommentController extends Controller
{
    //
    public function getComments() {
        $user = auth()->user();
        $comments = Comment::with('user', 'likes')->get();

        $comments->each(function($comment) use ($user) {
            $comment->user_has_liked = $comment->likes->contains('user_id', $user->id);
        });
        return view('publications.index', compact('comments'));
    }


    public function store(Request $request)
    {

        $request->validate([
            'content' => 'required|string',
            'publication_id' => 'required|integer|exists:publications,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp' // Validación de la imagen
        ]);

//        dd($request->all());
//        dd($request->content);
        $comment = new Comment();
        $comment->content = $request->input('content');
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
            $like->pivot->delete();
            $comment->decrement('likes');
        }

        return redirect()->back();
    }

    public function update(Request $request,Comment $comment)
    {
        Gate::authorize('update', $comment);

        $validated = $request->validate([
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048'
        ]);
        if($request->hasFile('image')){
            if($comment->image){
                Storage::disk('public')->delete($comment->image);
              }
            $imagePath = $request->file('image')->store('comments', 'public');
            $validated['image'] = $imagePath;
        }
        $comment->update($validated);


        return redirect()->back();
    }




    public function destroy(Comment $comment)
    {

        Gate::authorize('delete', $comment);

        $comment->delete();

        // return redirect(route('publications.index'));
        return redirect()->back();
    }

}
