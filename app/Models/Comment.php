<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Comment extends Model
{
    use HasFactory;

    // protected $fillable = [
    //     'publication_id',
    //     'user_id',
    //     'content',
    //     'likes'
    // ];

    protected $guarded = [];

    public function publication()
    {
        return $this->belongsTo(Publication::class);
    }

    // public function author():BelongsTo
    // {
    //     return $this->belongsTo(User::class, 'user_id');
    // }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

//    public function likes(): HasMany
//    {
//        return $this->hasMany(LikeComment::class);
//    }

    public function likes()
    {
        return $this->belongsToMany(User::class, 'like_comments')
            ->withTimestamps(); // assuming you have a pivot table 'likes'
    }

    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }


}
