<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FounderImage extends Model
{
    protected $table = 'founderimage';

    protected $fillable = [
        'title',
        'image',
        'description',
    ];
}
