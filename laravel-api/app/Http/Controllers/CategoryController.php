<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Category::query();

        if($request->has('text_search')){
            $query->where('name', "like", "%".$request->input('text_search')."%");
        }

        if($request->has('status')){
            $query->where('status', "=", $request->input('status'));
        }

        $catquery = $query->get();

        $cat = Category::all();

        return response()->json([
            "message" => "Get category",
            "cat" => $cat,
            "cat" => $catquery,
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
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $data = $request->all();

        $category = Category::create($data);

        return response()->json([
            'message' => 'Category created successfully',
            'category' => $category,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $cat = Category::find($category->id);

        $request->validate([
            'name' => 'required|string|max:50',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $data = $request->all();

        $category = $cat->update($data);

        return response()->json([
            'message' => 'Category updated successfully',
            'category' => $category,
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully',
            'delete' => $category,
        ]);
    }
}
