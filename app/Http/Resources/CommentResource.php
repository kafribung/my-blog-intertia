<?php

namespace App\Http\Resources;

use GrahamCampbell\Markdown\Facades\Markdown;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'body' => $this->body,
            'markdown_formatted' => Markdown::convert($this->body)->getContent(),
            'created_at' => $this->created_at->diffForHumans(),
            'can_be_replied' => $this->parent_id === null && $request->user(),
            'children' => self::collection($this->children),
            'likes_count' => $this->likes_count,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'gravatar' => $this->user->gravatar(100),
            ],
        ];
    }
}
