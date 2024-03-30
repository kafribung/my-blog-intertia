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
            'user_id' => rand(1, 2),
            'category_id' => rand(1, 7),
            'thumbnail' => $this->faker->sentence(3),
            'title' => $title = $this->faker->sentence,
            'slug' => str($title)->slug(),
            'teaser' => $this->faker->paragraph,
            'content' => $this->faker->paragraph,
            'published_at' => $this->faker->dateTimeBetween('-1 week'),
        ];
    }
}
