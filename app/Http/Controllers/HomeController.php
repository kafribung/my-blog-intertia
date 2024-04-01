<?php

namespace App\Http\Controllers;

use App\Enums;
use App\Http\Resources\ArticleBlockResource;
use App\Models\Article;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        return inertia('home', [
            'popular_articles' => fn () => ArticleBlockResource::collection(
                Article::query()
                    ->select(['id', 'category_id', 'user_id', 'title', 'slug', 'thumbnail', 'teaser', 'published_at'])
                    ->with(['category:id,name,slug', 'user:id,name'])
                    ->whereStatus(Enums\ArticleStatus::Published)
                    ->popularThisWeek()
                    ->limit(3)
                    ->get()
            ),
            'articles' => fn () => ArticleBlockResource::collection(
                Article::query()
                    ->select(['id', 'category_id', 'user_id', 'title', 'slug', 'thumbnail', 'teaser', 'published_at'])
                    ->with(['category:id,name,slug', 'user:id,name'])
                    ->where('status', Enums\ArticleStatus::Published)
                    ->latest('published_at')
                    ->limit(6)
                    ->get()
            ),
        ]);
    }
}
