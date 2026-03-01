<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\OrderDetail;
use App\Models\Provinces; // Assuming you have a Province model

class Order extends Model
{
    // use HasFactory;
    protected $table = 'orders';
    protected $fillable = [
        'buyer_name',
        'buyer_phone',
        'address',
        'province_id',
        'note',
        'payment_method',
        'total',
        'delivery_fee',
        'status',
        'transaction_image',
    ];

    // ✅ 1-to-Many relationship (Order has many OrderDetails)
    public function details()
    {
        return $this->hasMany(OrderDetail::class, 'order_id');
    }
    


    // (Optional) If you have a Province model
    public function province()
    {
        return $this->belongsTo(Provinces::class, 'province_id');
    }
}
