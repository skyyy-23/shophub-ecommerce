<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\TrackingController;
use App\Http\Controllers\Api\AuthController;

// Authentication routes
Route::middleware('web')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/admin/login', [AuthController::class, 'adminLogin']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        Route::get('/orders/{order}/tracking', [TrackingController::class, 'show']);
        Route::get('/users/{userId}/orders', [TrackingController::class, 'userOrders']);
        Route::post('/orders', [OrderController::class, 'store']);
    });
});

// Product routes: public read, admin write
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Admin routes (protected)
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/admin/register', [AuthController::class, 'adminRegister']);
    Route::post('/orders/{order}/tracking', [TrackingController::class, 'updateStatus']);
    Route::get('/admin/orders', [OrderController::class, 'index']); // Admin can see all orders
    Route::post('/products', [ProductController::class, 'store']);
    Route::post('/products/{product}', [ProductController::class, 'update']); // supporting method override
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
});
