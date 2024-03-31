<?php

namespace Database\Seeders;

use App\Models;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Models\User::factory(10)->hasArticles(12)->create();

        $articles = Models\Article::all();
        $tag_ids = Models\Tag::pluck('id');

        $articles->each(fn ($article) => $article->tags()->attach($tag_ids->random(3)->toArray()));
    }
}
