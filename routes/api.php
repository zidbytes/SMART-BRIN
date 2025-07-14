<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MetadataExtractorController;
use App\Http\Controllers\Api\DocumentStoreController;

Route::post('/extract-metadata', [MetadataExtractorController::class, 'extract']);
// Route::post('/save-document', [DocumentStoreController::class, 'store']); 
