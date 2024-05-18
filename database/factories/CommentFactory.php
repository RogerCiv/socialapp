<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $publications = \App\Models\Publication::all();
        $publicationId = $publications->random()->id;

        return [
            'publication_id' => $publicationId,
            'user_id' => $this->faker->numberBetween(1, 10),
            'content' => $this->faker->paragraph,
        ];
    }
}
