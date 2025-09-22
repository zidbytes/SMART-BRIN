<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DetailController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\TargetTahunanController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\Api\DocumentStoreController;

Route::get('/', function () {
    return Inertia::render('landingpage');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    // ==============================================
    // DASHBOARD
    // ==============================================
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');


    // ==============================================
    // CRUD DETAILS
    // ==============================================
    Route::get('/details', [DetailController::class, 'index'])->name('details');
    Route::post('/details/{type}/{id}/stamp', [DetailController::class, 'stamp'])->name('details.stamp');
    Route::patch('/details/update/{type}/{id}', [DetailController::class, 'update'])->name('details.update');
    Route::delete('/details/destroy/{type}/{id}', [DetailController::class, 'destroy'])->name('details.destroy');
    

    // ==============================================
    // TARGET TAHUNAN
    // ==============================================
    Route::get('/target-tahunan', [TargetTahunanController::class, 'index'])->name('target-tahunan.index');
    Route::post('/target-tahunan', [TargetTahunanController::class, 'store'])->name('target-tahunan.store');
    Route::get('/target-tahunan/edit/{id}', [TargetTahunanController::class, 'edit'])->name('target-tahunan.edit');
    Route::put('/target-tahunan/update/{id}', [TargetTahunanController::class, 'update'])->name('target-tahunan.update');
    Route::delete('/target-tahunan/delete/{id}', [TargetTahunanController::class, 'destroy'])->name('target-tahunan.destroy');

    // ==============================================
    // LAPORAN CAPAIAN
    // ==============================================
    Route::get('/report-capaian',        [ReportController::class, 'index'])->name('report-capaian.index');
    Route::get('/report-capaian/export', [ReportController::class, 'export'])->name('report-capaian.export');

    
    // ==============================================
    // USER MANAGEMENT
    // ==============================================
    Route::get('/users', [UserManagementController::class, 'index'])->name('users.index');
    Route::put('/users/{user}/role', [UserManagementController::class, 'updateRole'])->name('users.updateRole');
    Route::delete('/users/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy');


    // ==============================================
    // LLM UPLOAD DOCUMENTS
    // ==============================================
    Route::get('/upload-documents', function () {
    return Inertia::render('llm');
    });
    Route::post('/api/save-document', [DocumentStoreController::class, 'store'])->middleware(['auth']);
    
    // Route::get('/users', function () {
    // return Inertia::render('accountmanagement');
    // });

 

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
