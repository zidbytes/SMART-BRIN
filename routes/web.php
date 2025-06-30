<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController; // Import DashboardController
use App\Http\Controllers\DetailController;   // Import DetailController

Route::get('/', function () {
    return Inertia::render('landingpage');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Arahkan ke DashboardController
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Arahkan ke DetailController
    Route::get('/details', [DetailController::class, 'index'])->name('details');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';