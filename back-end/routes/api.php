<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OrderItemController;
use App\Http\Controllers\Api\TrackingController;
use App\Http\Controllers\Api\AuthController;

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});

// Test endpoint to debug products
Route::get('/debug-products', function () {
    $products = \App\Models\Product::all();
    return response()->json([
        'debug' => true,
        'products' => $products,
        'app_url' => env('APP_URL'),
        'storage_path' => storage_path('app/public/products'),
    ]);
});

// Tracking routes
Route::get('/orders/{orderId}/tracking', [TrackingController::class, 'show']);
Route::get('/users/{userId}/orders', [TrackingController::class, 'userOrders']);
Route::post('/orders/{orderId}/tracking', [TrackingController::class, 'updateStatus']);

// Product routes: public read, admin write
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
    Route::post('/products/{product}', [ProductController::class, 'update']); // supporting method override
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
});

// Order creation for authenticated users
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/orders', [OrderController::class, 'store']);
});

// Admin routes (protected)
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/orders', [OrderController::class, 'index']); // Admin can see all orders
});
