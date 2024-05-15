<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommentRequest;
use App\Models\Article;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class CommentController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    public function store(Request $request, Article $article)
    {
        $request->validate([
            'body' => ['required', 'string', 'min:3'],
        ]);

        $request->user()->comments()->create([
            'body' => $request->body,
            'article_id' => $article->id,
        ]);

        return back();
    }

    public function reply(Request $request, Comment $comment)
    {
        $request->validate([
            'body' => ['required', 'string', 'min:2'],
        ]);

        abort_if($comment->parent_id, 403, 'You can not reply to a reply.');

        $comment->children()->create([
            'body' => $request->body,
            'user_id' => $request->user()->id,
            'article_id' => $comment->article_id,
        ]);

        return back();
    }

    public function update(CommentRequest $request, Article $article, Comment $comment)
    {
        $comment->update($request->validated());

        return back();
    }
}
