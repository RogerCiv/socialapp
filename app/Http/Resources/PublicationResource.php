<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        $user = auth()->user();
        return [
            'id' => $this->id,
            'content' => $this->content,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                // Añade otros campos del usuario que necesites
            ],
            'likes' => $this->likePublications->count(),
            'liked' => $this->isLikedByUser(auth()->id()), // Añadir este campo
            'followed' => $user->followedUsers->contains($this->user->id), 
            'image' => $this->image,
        ];
    }
    
}
