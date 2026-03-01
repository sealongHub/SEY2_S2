<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockTransaction extends Model
{
    use HasFactory;

    // កំណត់ឈ្មោះ Table ឱ្យត្រូវនឹង Migration របស់អ្នក
    protected $table = 'stock_transactions';

    // កំណត់ Column ដែលអនុញ្ញាតឱ្យបញ្ចូលទិន្នន័យបាន (Mass Assignment)
    protected $fillable = [
        'product_id',   //
        'supplier_id',  // បន្ថែម supplier_id ទៅក្នុង $fillable
        'quantity',     //
        'cost_price',   // សម្រាប់គណនា Expense ក្នុង Dashboard
        'type',         // 'in', 'out', ឬ 'adjustment'
        'reason'        // ឧទាហរណ៍៖ "Sale Order #10"
    ];

    // បង្កើត Relationship ដើម្បីទាញឈ្មោះ Supplier មកបង្ហាញ
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * បង្កើត Relationship ត្រឡប់ទៅកាន់ Product វិញ
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}