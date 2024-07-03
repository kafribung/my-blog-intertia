<?php

namespace App\Http\Controllers;

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
    public function index()
    {
        $articles = Resources\ArticleBlockResource::collection(
            $self = Article::query()
                ->select(['id', 'category_id', 'user_id', 'title', 'slug', 'thumbnail', 'teaser', 'published_at'])
                ->with([
                    'category:id,name,slug',
                    'user:id,name',
                ])
                ->where('status', \App\Enums\ArticleStatus::Published)
                ->latest('published_at')
                ->paginate(9)
        )->additional(['meta' => ['has_pages' => $self->hasPages()]]);

        return inertia('articles/index', [
            'articles' => fn () => $articles,
            'page_meta' => [
                'title' => 'Articles',
                'description' => 'This is the latest articles from our blog. Enjoy!',
            ],
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
            'article' => fn () => new Resources\ArticleSingleResource(
                $article->loadCount('likes')->load(['category:id,name,slug', 'user:id,name', 'tags:id,name,slug'])
            ),
            'articles' => fn () => $relatedArticles,
            'comments' => fn () => Resources\CommentResource::collection(
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
        if (! $request->has('search')) {
            return [];
        }

        return Article::query()
            ->select('id', 'title', 'slug')
            ->where('title', 'like', "%{$request->search}%")
            ->whereStatus(\App\Enums\ArticleStatus::Published)
            ->limit(20)
            ->get()
            ->map(fn ($article) => [
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
