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
                except: ['index', 'show']
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
            ->latest('published_at')
            ->limit(4)
            ->get();

        return inertia('articles/show', [
            'article' => fn () => new Resources\ArticleSingleResource(
                $article->load(['category:id,name,slug', 'user:id,name', 'tags:id,name,slug'])
            ),
            'articles' => fn () => $relatedArticles,
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
}