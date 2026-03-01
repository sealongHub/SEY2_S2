<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class provinces extends Model
{
    protected $table = 'provinces';
    protected $fillable = ['name', 'description'];


    public function orders()
    {
        return $this->hasMany(Order::class, 'province_id');
    }

}


