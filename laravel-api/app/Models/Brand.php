<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Product;

class Brand extends Model
{
    protected $table = 'brands';

    protected $fillable = [
        'name',
        'code',
        'description',
        'status',
        'image',
    ];

    // one brand has many products
    public function products(){
        return $this->hasMany(Product::class, 'brand_id', 'id');
    }
}
