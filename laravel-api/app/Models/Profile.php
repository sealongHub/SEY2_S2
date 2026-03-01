<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Profile extends Model
{
    protected $table = "profiles";

    protected $fillable = [
        "user_id",
        "phone",
        "address",
        "imagee",
    ];

    //one profile belongsto one user
    public function user(){
        return $this->belongsTo(User::class);
    }
}
