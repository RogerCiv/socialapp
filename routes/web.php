<?php

use App\Http\Controllers\Follower\FollowerController;
use App\Http\Controllers\LikePublication\LikePublicationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Publication\PublicationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/publications/{publication}/like', [LikePublicationController::class, 'like'])->name('publications.like');
    Route::post('/publications/{publication}/unlike', [LikePublicationController::class, 'unlike'])->name('publications.unlike');
    Route::get('/publications/{publication}/likes', [LikePublicationController::class, 'getLikes'])->name('publications.likes');


    Route::post('/user/follow/{user}', [FollowerController::class, 'follow'])->name('user.follow');
    Route::post('/user/unfollow/{user}', [FollowerController::class, 'unfollow'])->name('user.unfollow');
    Route::get('/user/followers/{user}', [FollowerController::class, 'getFollowers'])->name('user.followers');

    Route::resource('/publications', PublicationController::class);

});

require __DIR__.'/auth.php';
