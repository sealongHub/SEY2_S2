<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;

class AuthController extends Controller
{
    //register
    public function register (Request $rq) {
        $rq->validate([
            "name" => "required|string",
            "email" => "required|email|unique:users,email",
            "password" => "required|string|min:6|confirmed",// key password_confirmation,
            "phone" => "required|string",
            "address" => "required|string",
            "imagee" => "nullable|image|mimes:jpeg,jpg,png,gif|max:2048",
        ]);

        //create user
        $user = User::create([
            "name" => $rq->name,
            "email" => $rq->email,
            "password" => Hash::make($rq->password),
        ]);

        if($rq->hasFile('imagee')){
            $imagePath = $rq->file('imagee')->store('profiles', 'public');
        }

        //create profile with user load
        $user->profiles()->create([
            "phone" => $rq->phone,
            "address" => $rq->address,
            "imagee" => $imagePath,
        ]);

        return response()->json([
            "message" => "User Registered Successfully",
            "user" => $user->load('profiles'),
        ],201);
    }

//Login

    public function login (Request $rq){
        $rq->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        //verify user and create token
        if(!$token = JWTAuth::attempt($rq->only('email', 'password'))){
            return response()->json([
                "error" => "Invalid Credentials"
            ],401);
        }

        return response()->json([
            "message" => "Login Successful",
            "access_token" => $token,
            "users" => JWTAuth::user()->load('profiles'),
        ]);
    }
}