<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\OrderDetail; 
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        try {
            // 1. Stats Cards
            $totalSales = Order::sum('total') ?? 0;
            $totalOrders = Order::count();
            $totalProducts = Product::count();
            $totalExpense = Product::sum('price') ?? 0;

            // 2. Weekly Sales (Last 7 Days)
            $weeklySales = Order::selectRaw("DATE(created_at) as date, SUM(total) as total")
                ->where('created_at', '>=', Carbon::now()->subDays(6))
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            $weeklyLabels = [];
            $weeklyData = [];

            for ($i = 6; $i >= 0; $i--) {
                $day = Carbon::now()->subDays($i);
                $weeklyLabels[] = $day->format('D'); 
                $daySale = $weeklySales->firstWhere('date', $day->toDateString());
                $weeklyData[] = $daySale ? (float)$daySale->total : 0;
            }

            // 3. Orders by Category
            $ordersByCategory = DB::table('order_details')
                ->join('products', 'order_details.product_id', '=', 'products.id')
                ->join('categories', 'products.category_id', '=', 'categories.id')
                ->selectRaw('categories.name as category, SUM(order_details.quantity) as total_qty')
                ->groupBy('categories.name')
                ->get();

            return response()->json([
                'stats' => [
                    'totalSales' => number_format($totalSales, 2, '.', ''),
                    'totalOrders' => $totalOrders,
                    'totalProducts' => $totalProducts,
                    'totalExpense' => number_format($totalExpense, 2, '.', ''), 
                ],
                'weeklySales' => [
                    'labels' => $weeklyLabels,
                    'data' => $weeklyData,
                ],
                'ordersByCategory' => [
                    'labels' => $ordersByCategory->pluck('category'),
                    'data' => $ordersByCategory->pluck('total_qty'),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}