<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DetailController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\TargetTahunanController;

Route::get('/', function () {
    return Inertia::render('landingpage');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Halaman Detail
    Route::get('/details', [DetailController::class, 'index'])->name('details');

    // CRUD DETAILS
    Route::get('/documents', [DocumentController::class, 'index'])->name('documents.index');
    Route::get('/documents/show/{document}', [DocumentController::class, 'show'])->name('documents.show');
    Route::post('/documents/store', [DocumentController::class, 'store'])->name('documents.store');
    Route::put('/documents/update/{document}', [DocumentController::class, 'update'])->name('documents.update');
    Route::delete('/documents/destroy/{document}', [DocumentController::class, 'destroy'])->name('documents.destroy');

    // Target Tahunan
    Route::get('/target-tahunan', [TargetTahunanController::class, 'index'])->name('target-tahunan.index');
    Route::post('/target-tahunan', [TargetTahunanController::class, 'store'])->name('target-tahunan.store');
    Route::get('/target-tahunan/edit/{id}', [TargetTahunanController::class, 'edit'])->name('target-tahunan.edit');
    Route::put('/target-tahunan/update/{id}', [TargetTahunanController::class, 'update'])->name('target-tahunan.update');
    Route::delete('/target-tahunan/delete/{id}', [TargetTahunanController::class, 'destroy'])->name('target-tahunan.destroy');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
