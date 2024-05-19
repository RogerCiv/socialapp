<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function publications(): HasMany
    {
        return $this->hasMany(Publication::class);
    }
    public function likedPublications()
    {
        return $this->belongsToMany(Publication::class, 'like_publications', 'user_id', 'publication_id');
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'follower_user', 'user_id', 'follower_id')->withTimestamps();
    }
    public function isFollowing(User $user)
    {
        return $this->followers()->where('user_id', $user->id)->count() > 0;
    }


    public function follow(User $user)
    {
        $this->followers()->attach($user->id);
    }

    public function unfollow(User $user)
    {
        $this->followers()->detach($user->id);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
