<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class OrdersController extends Controller
{
    /**
     * ✅ ១. ទាញយកបញ្ជី Order ទាំងអស់មកបង្ហាញក្នុង View (React)
     * ប្រើសម្រាប់បង្ហាញក្នុង Table នៅលើ Admin Dashboard
     */
    public function index()
    {
        // ទាញយក Order ទាំងអស់ដោយតម្រៀបពីថ្មីទៅចាស់
        $orders = Order::orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'list' => $orders
        ]);
    }

    /**
     * ✅ ២. ការរក្សាទុកការបញ្ជាទិញថ្មី (User Purchase)
     * ដំណើរការ៖ បង្កើត Order -> បង្កើត Details -> ដកស្តុកផលិតផលភ្លាមៗ
     */
    public function store(Request $request)
    {
        $request->validate([
            'buyer_name' => 'required|string|max:255',
            'buyer_phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'province_id' => 'required|integer',
            'note' => 'nullable|string',
            'payment_method' => 'required|string',
            'total' => 'required|numeric',
            'items' => 'required|string', // ទទួលជា JSON string ពី FormData
        ]);

        // បំប្លែង items ពី JSON string ទៅជា Array
        $items = json_decode($request->items, true);

        if (!$items || !is_array($items)) {
            return response()->json(['success' => false, 'message' => 'Invalid items data.'], 400);
        }

        DB::beginTransaction();
        try {
            // កត់ត្រាចូលតារាង orders
            $order = Order::create([
                'buyer_name' => $request->buyer_name,
                'buyer_phone' => $request->buyer_phone,
                'address' => $request->address,
                'province_id' => $request->province_id,
                'note' => $request->note,
                'payment_method' => $request->payment_method,
                'total' => $request->total,
                'delivery_fee' => $request->delivery_fee ?? 0,
                'transaction_image' => $request->transaction_image ?? null,
                'status' => 'pending' // កំណត់ជា Pending ជាមុនដើម្បីរង់ចាំ Admin ឆែកស្លីបលុយ
            ]);

            foreach ($items as $item) {
                $product = Product::findOrFail($item['product_id']);

                // ត្រួតពិនិត្យស្តុកមុននឹងលក់
                if ($item['quantity'] > $product->quantity) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false, 
                        'message' => "ផលិតផល {$product->name} មិនគ្រប់គ្រាន់ក្នុងស្តុកឡើយ (នៅសល់ត្រឹម {$product->quantity})"
                    ], 400);
                }

                // កត់ត្រាចូលតារាង order_details
                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'price' => $product->price,
                    'quantity' => $item['quantity'],
                    'subtotal' => $product->price * $item['quantity'],
                ]);

                // ✅ ឈានដល់ការដកស្តុកទុកមុន (Reserve Stock)
                // ទោះស្លីបបោក ឬពិត ក៏យើងដកសិនដើម្បីការពារកុំឱ្យអ្នកផ្សេងមកទិញជាន់ផលិតផលនេះ
                $product->decrement('quantity', $item['quantity']);
            }

            DB::commit();
            return response()->json([
                'success' => true, 
                'order_id' => $order->id,
                'message' => 'ការបញ្ជាទិញត្រូវបានបង្កើតដោយជោគជ័យ!'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false, 
                'message' => 'បរាជ័យក្នុងការបង្កើត Order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ ៣. មុខងារសម្រាប់ប្តូរ Status (Pending -> Approved / Cancelled)
     * ប្រើនៅពេល Admin ចុចប៊ូតុងក្នុង Dashboard
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:approved,cancelled']);
        
        DB::beginTransaction();
        try {
            $order = Order::findOrFail($id);

            // ករណីទី១៖ បើ Admin ចុច Cancel (ប៊ូតុងក្រហម)
            // យើងត្រូវយកទំនិញដែលបានដកពីមុនមក "បូកបញ្ចូលក្នុងស្តុកវិញ"
            if ($request->status == 'cancelled' && $order->status == 'pending') {
                $details = OrderDetail::where('order_id', $id)->get();
                foreach ($details as $item) {
                    // បូកស្តុកត្រឡប់ទៅក្នុងតារាង products វិញ
                    Product::where('id', $item->product_id)->increment('quantity', $item->quantity);
                    
                    // (ជម្រើសបន្ថែម) បើបងមានតារាង stock_transactions អាចកត់ត្រាចូលទីនោះបាន
                    DB::table('stock_transactions')->insert([
                        'product_id' => $item->product_id,
                        'quantity'   => $item->quantity,
                        'type'       => 'in',
                        'reason'     => "បូកចូលវិញដោយសារការ Cancel វិក្កយបត្រ #{$id}",
                        'created_at' => now()
                    ]);
                }
            }

            // ករណីទី២៖ បើ Admin ចុច Approve (ប៊ូតុងបៃតង)
            // មិនចាំបាច់ដកស្តុកទៀតទេ ព្រោះ store() បានដករួចជាស្រេចហើយ
            
            // ធ្វើបច្ចុប្បន្នភាពស្ថានភាពទៅក្នុងតារាង orders
            $order->update(['status' => $request->status]);
            
            DB::commit();
            return response()->json([
                'success' => true, 
                'message' => "ស្ថានភាព Order ត្រូវបានប្តូរទៅជា " . strtoupper($request->status)
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false, 
                'message' => 'ការប្តូរស្ថានភាពបរាជ័យ: ' . $e->getMessage()
            ], 500);
        }
    }
}