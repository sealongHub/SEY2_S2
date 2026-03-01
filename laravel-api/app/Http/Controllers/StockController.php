<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\StockTransaction;
use Illuminate\Support\Facades\DB;

class StockController extends Controller {
    // សម្រាប់ Admin បញ្ចូលស្តុកថ្មី (Stock In)
    public function stockIn(Request $request) {
        return DB::transaction(function () use ($request) {
            // 1. បង្កើត Transaction Log
            StockTransaction::create([
                'product_id' => $request->product_id,
                'supplier_id' => $request->supplier_id,
                'quantity'   => $request->qty,
                'cost_price' => $request->cost_price, 
                'type'       => 'in',
                'reason'     => 'Restock from supplier',
            ]);

            // 2. បូកបន្ថែមចំនួនក្នុង Table Products
            $product = Product::findOrFail($request->product_id);
            $product->increment('quantity', $request->qty); 

            return response()->json(['success' => true, 'message' => 'Stock In Successful']);
        });
    }

    // សម្រាប់ទាញលេខបង្ហាញលើ Dashboard
    public function getDashboardStats() {
        $totalSales = DB::table('orders')->sum('total_amount'); 
        $totalExpense = DB::table('stock_transactions')
            ->where('type', 'in')
            ->select(DB::raw('SUM(quantity * cost_price) as total'))
            ->value('total') ?? 0;

        return response()->json([
            'total_sales' => $totalSales,
            'total_expense' => $totalExpense,
        ]);
    }

    // ក្នុង StockController.php
public function history() {
    $list = StockTransaction::with('product')
            ->orderBy('created_at', 'desc') 
            ->get(); // ទាញយកទាំងអស់មកបង្ហាញ
    return response()->json(['list' => $list]);
}
}