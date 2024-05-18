<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    public function author():BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

  
    
    public function likes()
    {
        return $this->hasMany(LikeComment::class);
    }
}
