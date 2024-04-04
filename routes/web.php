<?php

use App\Http\Controllers;
use Illuminate\Support\Facades\Route;

Route::get('', Controllers\HomeController::class)->name('home');
Route::get('dashboard', Controllers\DashboardController::class)->middleware(['auth'])->name('dashboard');
Route::get('articles/categories/{category:slug}', [Controllers\CategoryController::class, 'show'])->name('categories.show');
Route::get('articles/tags/{tag:slug}', [Controllers\TagController::class, 'show'])->name('tags.show');
Route::resource('articles', Controllers\ArticleController::class)
    ->scoped(['article' => 'slug'])
    ->only('show', 'index');
Route::middleware('auth')->group(function () {
    Route::get('/profile', [Controllers\ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [Controllers\ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [Controllers\ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
