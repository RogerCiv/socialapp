<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Publication>
 */
class PublicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => 1,
            'content' => $this->faker->paragraph,
            'image' => $this->faker->imageUrl(),
            'is_published' => $this->faker->boolean,
            'published_at' => $this->faker->dateTime,
        ];
    }
}
