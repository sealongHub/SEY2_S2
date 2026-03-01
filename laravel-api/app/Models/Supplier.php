<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\StockTransaction;

class Supplier extends Model
{
    protected $table = 'suppliers'; 
    protected $fillable = ['name', 'contact_name', 'phone', 'email', 'address', 'status'];

  
    public function stockTransactions(): HasMany
    {
        return $this->hasMany(StockTransaction::class, 'supplier_id');
    }
}