<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Article>
 */
class ArticleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'category_id' => rand(1, 7),
            'title' => $title = $this->faker->sentence,
            'slug' => str($title)->slug(),
            'teaser' => $this->faker->paragraph,
            'content' => $this->faker->paragraphs(4, true),
            'status' => $status = $this->faker->randomElement(['draft', 'pending', 'published']),
            'published_at' => $status === 'published' ? $this->faker->dateTimeBetween('-1 month', 'now') : null,
        ];
    }
}
