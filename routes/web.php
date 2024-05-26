<?php

use App\Http\Controllers\Comment\CommentController;
use App\Http\Controllers\Follower\FollowerController;
use App\Http\Controllers\Info\InfoController;
use App\Http\Controllers\LikePublication\LikePublicationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Publication\PublicationController;
use App\Http\Controllers\User\UserController;
use App\Models\Comment;
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

Route::get('/u/{user:name}', [ProfileController::class, 'index'])->middleware(['auth', 'verified'])->name('profile');

Route::middleware('auth')->group(function () {

    // Route::resource('/info', ProfileController::class);


    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::group(['namespace' => 'Publication'], function () {
        Route::get('/publications', [PublicationController::class, 'index'])->name('publications.index');
        Route::post('/publications', [PublicationController::class, 'store'])->name('publications.store');
        Route::get('/publications/{publication}', [PublicationController::class, 'show'])->name('publications.show');

        Route::post('/publications/{publication}', [PublicationController::class, 'update'])->name('publications.update');
        Route::delete('/publications/{publication}', [PublicationController::class, 'destroy'])->name('publications.destroy');
        Route::post('/publications/{publication}/like', [LikePublicationController::class, 'like'])->name('publications.like');
        Route::post('/publications/{publication}/unlike', [LikePublicationController::class, 'unlike'])->name('publications.unlike');
        Route::get('/publications/{publication}/likes', [LikePublicationController::class, 'getLikes'])->name('publications.likes');
    });


    Route::post('/user/follow/{user}', [UserController::class, 'follow'])->name('user.follow');
    Route::post('/user/unfollow/{user}', [UserController::class, 'unfollow'])->name('user.unfollow');
    Route::get('/user/followers/{user}', [UserController::class, 'getFollowers'])->name('user.followers');


    // Route::resource('/publications', PublicationController::class);


    // Route::resource('/comments', CommentController::class);
    Route::get('/comments', [CommentController::class, 'getComments'])->name('comments.index');
    Route::post('/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::get('/comments/{comment}', [CommentController::class, 'show'])->name('comments.show');
    Route::get('/comments/{comment}/edit', [CommentController::class, 'edit'])->name('comments.edit');
    Route::post('/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
    Route::post('/comments/{publication}/like', [CommentController::class, 'like'])->name('comments.like');
    Route::post('/comments/{publication}/unlike', [CommentController::class, 'unlike'])->name('comments.unlike');
    Route::get('/comments/{publication}/likes', [CommentController::class, 'getLikes'])->name('comments.likes');
    Route::resource('/info', InfoController::class);

    Route::get('/info', [PublicationController::class, 'getMyPublications'])->name('publications.my');
    // Route::get('/info', [FollowerController::class, 'getFollowers'])->name('followers.followers');

    Route::get('/user/followed', [UserController::class, 'followedUsers'])->name('user.followed');

});

require __DIR__ . '/auth.php';
