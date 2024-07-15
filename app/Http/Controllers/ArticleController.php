<?php

namespace App\Http\Controllers;

use App\Enums\ArticleStatus;
use App\Http\Resources;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers;
use Illuminate\Routing\Controllers\HasMiddleware;

class ArticleController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Controllers\Middleware(
                middleware: ['auth'],
                except: ['index', 'show', 'search', 'like']
            ),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index($key = 'latest')
    {
        $articles = Article::query()
            ->select(['id', 'category_id', 'user_id', 'title', 'slug', 'thumbnail', 'teaser', 'status', 'published_at'])
            ->with('category:id,name,slug', 'user:id,name')
            ->where('status', ArticleStatus::Published)
            ->when($key === 'latest', fn($query) => $query->latest('published_at'))
            ->when($key === 'trending', fn($query) => $query->trending())
            ->when($key === 'most-likes', fn($query) => $query->mostLikes())
            ->when($key === 'year', fn($query) => $query->popularThisYear())
            ->when($key === 'month', fn($query) => $query->popularThisMonth())
            ->when($key === 'week', fn($query) => $query->popularThisWeek())
            ->when($key === 'all-time', fn($query) => $query->popularAllTime())
            ->paginate(9);

        abort_unless($articles->count(), 404);

        $title = '';
        $description = '';
        $pageMeta = [
            'latest' => ['title' => $title = 'Latest Articles', 'description' => $description = 'The latest articles from our blog.'],
            'trending' => ['title' => 'Trending Articles', 'description' => 'The most trending articles.'],
            'most-likes' => ['title' => 'Most Likes Article', 'description' => 'The most likes articles.'],
            'year' => ['title' => 'Popular This Year', 'description' => 'The most popular articles of this year.'],
            'month' => ['title' => 'Popular This Month', 'description' => 'The most popular articles of this month.'],
            'week' => ['title' => 'Popular This Week', 'description' => 'The most popular articles of this week.'],
            'all-time' => ['title' => 'Popular All Time', 'description' => 'The most popular articles of all time.'],
        ]
        [$key] ?? ['title' => $title, 'description' => $description];

        return inertia('articles/index', [
            'articles' => fn() => Resources\ArticleBlockResource::collection($articles)
                ->additional(['meta' => ['has_pages' => $articles->hasPages()]]),
            'page_meta' => $pageMeta,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Article $article)
    {
        $relatedArticles = Article::query()->select(['id', 'title', 'slug', 'teaser', 'user_id'])
            ->where('category_id', $article->category_id)
            ->with('user:id,name')
            ->where('id', '!=', $article->id)
            ->where('status', \App\Enums\ArticleStatus::Published)
            ->latest('published_at')
            ->limit(4)
            ->get();

        if ($article->status == \App\Enums\ArticleStatus::Pending) {
            return abort_if($article->user_id != auth()->id(), 403);
        }

        return inertia('articles/show', [
            'article' => fn() => new Resources\ArticleSingleResource(
                $article->loadCount('likes')->load(['category:id,name,slug', 'user:id,name', 'tags:id,name,slug'])
            ),
            'articles' => fn() => $relatedArticles,
            'comments' => fn() => Resources\CommentResource::collection(
                $article->comments()
                    ->where('article_id', $article->id)
                    ->whereParentId(null)
                    ->latest()
                    ->get()
            ),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Article $article)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Article $article)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article)
    {
        //
    }

    /**
     * Search the specified resource in storage.
     */
    public function search(Request $request)
    {
        if (!$request->has('search')) {
            return [];
        }

        return Article::query()
            ->select('id', 'title', 'slug')
            ->where('title', 'like', "%{$request->search}%")
            ->whereStatus(\App\Enums\ArticleStatus::Published)
            ->limit(20)
            ->get()
            ->map(fn($article) => [
                'id' => $article->id,
                'title' => $article->title,
                'href' => route('articles.show', $article->slug),
            ]);
    }

    public function like(Request $request, Article $article)
    {
        if ($request->user()) {
            $like = $article->likes()->where('user_id', $request->user()->id)->first();

            if ($like) {
                $like->delete();
            } else {
                $article->likes()->create(['user_id' => $request->user()->id]);
            }
        } else {
            flashMessage(
                'You need to login to like this article.',
                'warning',
            );
        }

        return back();
    }
}
