<?php

namespace App\Http\Controllers;

use App\Enums\ArticleStatus;
use App\Http\Requests\ArticleRequest;
use App\Http\Resources;
use App\Models;
use Coderflex\Laravisit\Models\Visit;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class InternalArticleController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware(middleware: ['auth']),
            new Middleware(
                middleware: ['role:admin'],
                only: ['destroy', 'approve']
            ),
        ];
    }

    public function index(Request $request)
    {
        $totalVisits = Visit::query()->where('visitable_type', Models\Article::class)->count();
        $articles = Resources\ArticleListResource::collection(
            $self = Models\Article::query()
                ->select(['id', 'user_id', 'category_id', 'title', 'slug', 'published_at', 'created_at', 'status'])
                ->with([
                    'user:id,name',
                    'category:id,name,slug',
                    'tags:id,name,slug',
                ])
                ->when($request->search, fn ($query, $value) => $query->where('title', 'like', '%'.$value.'%'))
                ->when($request->status, fn ($query, $value) => $query->where('status', $value))
                ->withTotalVisitCount()
                ->when(! $request->user()->hasRole('admin'), fn ($query) => $query->whereBelongsTo($request->user()))
                ->latest()
                ->paginate(10)
                ->withQueryString()
        )->additional([
            'meta' => [
                'has_pages' => $self->hasPages(),
                'total_visits' => $totalVisits,
                'unpublished_count' => Models\Article::query()
                    ->where('status', '!=', 'published')
                    ->when(! $request->user()->hasRole('admin'), fn ($query) => $query->whereBelongsTo($request->user()))
                    ->count(),
            ],
        ]);

        return inertia('articles/internal-articles/list', [
            'articles' => fn () => $articles,
            'state' => $request->only('page', 'status', 'search'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('articles/internal-articles/form', [
            'page_data' => fn () => [
                'categories' => fn () => Models\Category::toSelectArray(),
                'tags' => fn () => Models\Tag::toSelectArray(),
                'article' => fn () => new Models\Article(),
                'statuses' => fn () => ArticleStatus::toSelectArray(),
            ],
            'page_meta' => [
                'title' => 'Create new Article',
                'description' => "Grow your audience by creating the best articles'.",
                'url' => route('internal-articles.store'),
                'method' => 'put',
            ],
        ]);
    }

    public function store(ArticleRequest $request)
    {
        $validatedData = $request->validated();
        unset($validatedData['tags']);

        dd($validatedData);
        $article = $request->user()->articles()->create([
            ...$validatedData,
            'status' => $request->user()->hasRole('admin') ? $request->status : ArticleStatus::Pending,
            'thumbnail' => $request->file('thumbnail') ? $request->file('thumbnail')->store('thumbnails', 'public') : '',
            'published_at' => $request->enum('status', ArticleStatus::class) === ArticleStatus::Published ? now() : null,
        ]);

        $article->tags()->sync($request->tags);

        return redirect()->route('internal-articles.index');
    }

    public function edit(Models\Article $article)
    {
        return inertia('articles/internal-articles/form', [
            'page_data' => fn () => [
                'categories' => fn () => Models\Category::toSelectArray(),
                'tags' => fn () => Models\Tag::toSelectArray(),
                'article' => fn () => $article->load('tags', 'category:id,name'),
                'statuses' => fn () => ArticleStatus::toSelectArray(),
            ],
            'page_meta' => [
                'title' => 'Edit Article',
                'description' => "Edit the article titled '{$article->title}'.",
                'url' => route('internal-articles.update', $article),
                'method' => 'put',
            ],
        ]);
    }

    public function update(ArticleRequest $request, Models\Article $article)
    {
        $validatedData = $request->validated();
        unset($validatedData['tags']);
        $article->update([
            ...$validatedData,
            'status' => $request->enum('status', ArticleStatus::class),
            'thumbnail' => $request->file('thumbnail') ? $request->file('thumbnail')->store('thumbnails', 'public') : '',
            'published_at' => $request->enum('status', ArticleStatus::class) === ArticleStatus::Published ? now() : null,
        ]);

        $article->tags()->sync($request->tags);

        return redirect()->route('internal-articles.index');
    }

    public function destroy(Models\Article $article)
    {
        $article->delete();

        return redirect()->route('internal-articles.index');
    }

    public function approve(Models\Article $article)
    {
        $article->update([
            'status' => $article->status === ArticleStatus::Published ? ArticleStatus::Pending : ArticleStatus::Published,
            'published_at' => $article->status === ArticleStatus::Published ? null : now(),
        ]);

        return redirect()->route('internal-articles.index');
    }
}
