<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Brand::query();

        if($request->has('text_search')){
            $query->where('name', "like", "%".$request->input('text_search')."%");
        }

        if($request->has('status')){
            $query->where('status', "=", $request->input('status'));
        }

        $brandQuery = $query->get();

        $brand = Brand::all();

        return response()->json([
            "message" => "Get Brands",
            "brandList" => $brand,
            "brandList" => $brandQuery,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'code' => 'required|unique:brands,code',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = $request->all();

        if($data['image']){
            $imagePath = $request->file('image')->store('brands', 'public');
            $data['image'] = $imagePath;
        }

        $brand = Brand::create($data);

        return response()->json([
            'message' => 'Brand created successfully',
            'data' => $brand,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Brand $brand)
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Brand $brand)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $brand = Brand::find($id);

        $request->validate([
            'name' => 'required|string|max:50',
            'code' => 'required|unique:brands,code,'.$id,
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = $request->all();

        if($request->hasFile('image')){
            if($brand->image){
                Storage::disk('public')->delete($brand->image);
            }
            $imagePath = $request->file('image')->store('brands', 'public');
            $data['image'] = $imagePath;
        }

        if($request->filled('image_remove')){
            Storage::disk('public')->delete($brand->image);

            $brand->image = null;
        }


        $brand->update($data);

        return response()->json([
            'message' => 'Brand updated successfully',
            'data' => $brand,
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
        $brand = Brand::find($brand->id);

        if($brand->image){
            Storage::disk('public')->delete($brand->image);
        }
        $brand->delete();

        return response()->json([
            'message' => 'Brand deleted successfully',
        ], 200);
    }
}
