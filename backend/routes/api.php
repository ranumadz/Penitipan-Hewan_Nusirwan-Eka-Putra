<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PenitipanController;

Route::get('/penitipans', [PenitipanController::class,'index']);
Route::post('/penitipans', [PenitipanController::class,'store']);
Route::get('/penitipans/{id}', [PenitipanController::class,'show']);
Route::put('/penitipans/{id}', [PenitipanController::class,'update']);
Route::delete('/penitipans/{id}', [PenitipanController::class,'destroy']);
