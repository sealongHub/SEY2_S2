<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FounderImageController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\SupplierController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('role', [RoleController::class, 'index']);
Route::post('role', [RoleController::class, 'store']);
Route::get('role/{id}', [RoleController::class, 'show']);
Route::put('role/{id}', [RoleController::class, 'update']);
Route::delete('role/{id}', [RoleController::class, 'destroy']);

Route::apiResource('category', CategoryController::class);
Route::apiResource('brand', BrandController::class);
Route::apiResource('product', ProductController::class);

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Founder Image Routes
Route::apiResource('founderimage', App\Http\Controllers\FounderImageController::class);
// Province Routes
Route::apiResource('provinces', App\Http\Controllers\ProvincesController::class);
// Purchase Routes
Route::post('purchase', [App\Http\Controllers\purchaseController::class, 'store']);

// ✅ Create a new order (store order + subtract stock)
Route::post('/orders', [OrdersController::class, 'store']);

// (Optional) View all orders
Route::get('/orders', [OrdersController::class, 'index']);

// (Optional) View one order with details
Route::get('/orders/{id}', [OrdersController::class, 'show']);
// ត្រូវប្រើ Route::put ព្រោះក្នុង React បងហៅ request(..., 'put')
Route::put('orders/{id}/status', [App\Http\Controllers\OrdersController::class, 'updateStatus']);

// routes/api.php
Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'stats']);

Route::get('/dashboardv1', [App\Http\Controllers\DashboardController::class, 'test']);

Route::post('/stock-in', [StockController::class, 'stockIn']);

Route::get('stock-transaction', [StockController::class, 'history']);



// បង្កើត Route សម្រាប់ Supplier CRUD
Route::apiResource('supplier', SupplierController::class);

// ប្រសិនបើអ្នកចង់ឱ្យវាទាញយកបញ្ជី Supplier សម្រាប់ដាក់ក្នុង Dropdown បញ្ចូលស្តុក
Route::get('supplier-list', [SupplierController::class, 'getSupplierList']);


