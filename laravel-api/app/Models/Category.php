<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Product;

class Category extends Model
{
    protected $table = "categories";

    protected $fillable = [
        'name',
        'description',
        'status'
    ];

    // one category has many products
    public function products(){
        return $this->hasMany(Product::class, 'category_id', 'id');
    }
}
