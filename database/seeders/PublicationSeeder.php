<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Publication;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PublicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::pluck('id');

//        Publication::factory()
//            ->count(3)
//            ->hasComments(3)
//            ->create([
//                'user_id' => $users->random(),
//            ]);
//
//        Publication::factory()
//            ->count(2)
//            ->hasComments(4)
//            ->create([
//                'user_id' => $users->random(),
//            ]);
//
//            Publication::factory()
//            ->count(4)
//            ->hasComments(10)
//            ->create([
//                'user_id' => $users->random(),
//            ]);
//
//            Publication::factory()
//            ->count(1)
//            ->hasComments(2)
//            ->create([
//                'user_id' => $users->random(),
//            ]);


        for ($i = 0; $i < 30; $i++) {
            $publication = Publication::factory()->create(['user_id' => $users->random()]);
            $numberOfComments = rand(1, 5);
            for ($j = 0; $j < $numberOfComments; $j++) {
                Comment::factory()->create([
                    'publication_id' => $publication->id,
                    'user_id' => $users->random(),
                ]);
            }
        }
    }
}
