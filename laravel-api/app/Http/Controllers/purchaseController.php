<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Product;

class purchaseController extends Controller
{
    public function store(Request $request)
    {
        // ✅ Validate request
        $request->validate([
            'buyer_name' => 'required|string|max:255',
            'buyer_phone' => 'required|string|max:50',
            'address' => 'required|string|max:255',
            'province_id' => 'required|integer',
            'payment_method' => 'required|string',
            'total' => 'required|numeric',
            'items' => 'required|string', // ប្រាកដថាផ្ញើជា JSON string មក
            'transaction_image' => 'nullable|file|image|max:2048',
            'note' => 'nullable|string',
            'delivery_fee' => 'nullable|numeric',
        ]);

        DB::beginTransaction();

        try {
            // ✅ Handle uploaded transaction image
            $imagePath = null;
            if ($request->hasFile('transaction_image')) {
                $imagePath = $request->file('transaction_image')->store('transactions', 'public');
            }

            // ✅ Insert order
            $orderId = DB::table('orders')->insertGetId([
                'buyer_name' => $request->buyer_name,
                'buyer_phone' => $request->buyer_phone,
                'address' => $request->address,
                'province_id' => $request->province_id,
                'note' => $request->note ?? null,
                'payment_method' => $request->payment_method,
                'total' => $request->total,
                'delivery_fee' => $request->delivery_fee ?? 0,
                'transaction_image' => $imagePath,
                'created_at' => now(),
            ]);

            // ✅ រៀបចំទិន្នន័យសម្រាប់ Telegram និងបច្ចុប្បន្នភាពស្តុក
            $items = json_decode($request->items, true); 
            $itemsText = ""; 

            foreach ($items as $item) {
                $product = Product::find($item['id']);

                if ($product) {
                    $buyQty = $item['qty']; 

                    if ($product->quantity >= $buyQty) {
                        // ១. ដកចំនួនចេញពីស្តុក
                        $product->decrement('quantity', $buyQty); 

                        // ២. បញ្ចូលទៅក្នុង order_details (ចំណុចដែលខ្វះពីមុន)
                        DB::table('order_details')->insert([
                            'order_id'   => $orderId,
                            'product_id' => $product->id,
                            'quantity'   => $buyQty,
                            'price'      => $product->price,
                            'subtotal'   => $product->price * $buyQty,
                            'created_at' => now(),
                        ]);

                        // ៣. កត់ត្រាចូល Stock History
                        \App\Models\StockTransaction::create([
                            'product_id' => $product->id,
                            'quantity'   => $buyQty,
                            'cost_price' => $product->price, 
                            'type'       => 'out',
                            'note'       => 'Purchase: Order #' . $orderId . ' by ' . $request->buyer_name,
                            'user_id'    => null,
                        ]);

                        // ៤. បង្កើតអត្ថបទសម្រាប់ Telegram
                        $itemsText .= "• {$product->name} ({$buyQty}x) = $" . number_format($product->price * $buyQty, 2) . "\n";

                    } else {
                        DB::rollBack();
                        return response()->json(['success' => false, 'message' => "Product {$product->name} out of stock!"], 400);
                    }
                }
            }

            // ✅ Fetch order and details សម្រាប់ការបង្កើត PDF
            $order = DB::table('orders')->where('id', $orderId)->first();
            $details = DB::table('order_details')->where('order_id', $orderId)->get();

            // ✅ Generate PDF receipt
            $pdf = Pdf::loadView('receipt', compact('order', 'details'));
            $fileName = 'receipt_' . $orderId . '.pdf';
            $pdfPath = 'receipts/' . $fileName;
            Storage::disk('public')->put($pdfPath, $pdf->output());
            $receiptUrl = asset('storage/' . $pdfPath);

            // ✅ Send message to Telegram
            try {
                $botToken = env('TELEGRAM_BOT_TOKEN');
                $chatId = env('TELEGRAM_CHAT_ID');

                $province = DB::table('provinces')->where('id', $order->province_id)->first();
                $provinceName = $province ? $province->name : "Unknown";

                $caption = "📦 *New Purchase Received!*\n\n"
                    . "👤 *Buyer:* {$order->buyer_name}\n"
                    . "📞 *Phone:* {$order->buyer_phone}\n"
                    . "🏠 *Address:* {$order->address}\n"
                    . "📍 *Province:* {$provinceName}\n"
                    . "💳 *Payment:* " . strtoupper($order->payment_method) . "\n"
                    . "💰 *Total:* $" . number_format($order->total, 2) . "\n"
                    . "🧾 [View Receipt]($receiptUrl)\n\n"
                    . "🛒 *Items:*\n" . ($itemsText ?: "No items listed.");

                if ($order->transaction_image) {
                    $imagePathFull = storage_path('app/public/' . $order->transaction_image);
                    Http::attach(
                        'photo', file_get_contents($imagePathFull), basename($imagePathFull)
                    )->post("https://api.telegram.org/bot{$botToken}/sendPhoto", [
                        'chat_id' => $chatId,
                        'caption' => $caption,
                        'parse_mode' => 'Markdown',
                    ]);
                } else {
                    Http::post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                        'chat_id' => $chatId,
                        'text' => $caption,
                        'parse_mode' => 'Markdown',
                        'disable_web_page_preview' => false,
                    ]);
                }
            } catch (\Exception $e) {
                \Log::error("Telegram message failed: " . $e->getMessage());
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'order_id' => $orderId,
                'receipt_url' => $receiptUrl,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }
}