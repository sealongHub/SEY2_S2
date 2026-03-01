<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Order;
use App\Models\Product; // Assuming you have a Product model

class OrderDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price',
        'subtotal',
    ];

    // ✅ Belongs to one order
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    // (Optional) If you have a Product model
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
