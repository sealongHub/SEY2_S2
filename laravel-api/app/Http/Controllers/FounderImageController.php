<?php

namespace App\Http\Controllers;

use App\Models\FounderImage;
use Illuminate\Http\Request;

class FounderImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $founderImage = FounderImage::all();

        return response()->json([
            "message" => "Get Founder Images",
            "founderImageList" => $founderImage,
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
            'title' => 'required|string|max:50',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'nullable|string',
        ]);

        $data = $request->all();

        if($data['image']){
            $imagePath = $request->file('image')->store('founderimages', 'public');
            $data['image'] = $imagePath;
        }

        $founderImage = FounderImage::create($data);
        return response()->json([
            'message' => 'Founder Image created successfully',
            'data' => $founderImage,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(FounderImage $founderImage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FounderImage $founderImage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    // public function update(Request $request, $id)
    // {
    //     $founderImage = FounderImage::find($id);

    //     $request->validate([
            
    //         'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    //     ]);

    //     $data = $request->all();

    //     if($request->hasFile('image')){
    //         if($founderImage->image){
    //             Storage::disk('public')->delete($founderImage->image);
    //         }
    //         $imagePath = $request->file('image')->store('founderimages', 'public');
    //         $data['image'] = $imagePath;
    //     }

    //     if($request->filled('image_remove')){
    //         Storage::disk('public')->delete($founderImage->image);

    //         $founderImage->image = null;
    //     }


    //     $founderImage->update($data);
    //     return response()->json([
    //         'message' => 'Founder Image updated successfully',
    //         'data' => $founderImage,
    //     ], 201);
    // }

    public function update(Request $request, $id)
    {
        $founderImage = FounderImage::find($id);

        $request->validate([
            'title' => 'required|string|max:50',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'nullable|string',
        ]);

        $data = $request->all();

        if($request->has('image')){
            if($founderImage->image){
                Storage::disk('public')->delete($founderImage->image);
            }
            $imagePath = $request->file('image')->store('founderimages', 'public');
            $data['image'] = $imagePath;
        }

        if($request->filled('image_remove')){
            Storage::disk('public')->delete($founderImage->image);

            $founderImage->image = null;
        }

        $founderImage->update($data);
        return response()->json([
            'message' => 'Founder Image updated successfully',
            'data' => $founderImage,
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $founderImageToDelete = FounderImage::find($id);

        if($founderImageToDelete->image){
            Storage::disk('public')->delete($founderImageToDelete->image);
        }
        $founderImageToDelete->delete();

        return response()->json([
            'message' => 'Founder Image deleted successfully',
        ], 200);
    }
}
