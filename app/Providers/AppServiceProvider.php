<?php

namespace App\Providers;

use App\Models\Comment;
use App\Policies\CommentPolicy;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    // protected $policies = [
    //     Comment::class => CommentPolicy::class,
    // ];
    /**
     * Register any application services.
     */
    public function register(): void
    {
        Gate::policy(Comment::class, CommentPolicy::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();
        \Illuminate\Database\Eloquent\Model::unguard();
    }
}
