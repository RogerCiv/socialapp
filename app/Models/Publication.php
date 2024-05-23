<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Publication extends Model
{
    use HasFactory;

    // protected $fillable = [
    //     'user_id',
    //     'content',
    //     'image',
    //     'is_published',
    //     'published_at',
    //     'likes'
    // ];

    protected $guarded = [];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public static function postsForTimeline($userId, $getLatest = true): Builder
    {
        $query = Publication::query()
            ->withCount('likes')
            ->with([
                'user:id,name,avatar',
                'comments' => function ($query) {
                    $query->with('user:id,name,avatar');
                    $query->with('likes:id');
                },
                'likes:id',
            ]);

        if ($getLatest) {
            $query->latest();
        }

        return $query;
    }



    // Relación con el modelo Publication
    public function publication()
    {
        return $this->belongsTo(Publication::class);
    }

    public function likePublications()
    {
        return $this->hasMany(LikePublication::class);
    }

    public function isLikedByUser($userId)
    {
        return $this->likePublications()->where('user_id', $userId)->exists();
    }

//    public function likes()
//{
//    return $this->hasMany(LikePublication::class);
//}
    public function likes()
    {
        return $this->belongsToMany(User::class, 'like_publications')
            ->withTimestamps(); // assuming you have a pivot table 'likes'
    }
}
