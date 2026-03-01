<?php

namespace App\Http\Controllers;

use App\Models\provinces;
use Illuminate\Http\Request;

class ProvincesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $query = provinces::query();

        if($request->has('text_search')){
            $query->where('name', "like", "%".$request->input('text_search')."%");
        }

        $provinces = $query->get();

        return response()->json([
            "message" => "Get provinces",
            "provinces" => $provinces,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'description' => 'nullable|string',
        ]);

        $data = $request->all();

        $province = provinces::create($data);

        return response()->json([
            'message' => 'Province created successfully',
            'province' => $province,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(provinces $provinces)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(provinces $provinces)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $pro = provinces::find($id);

        $request->validate([
            'name' => 'required|string|max:50',
            'description' => 'nullable|string',
        ]);

        $data = $request->all();

        $province = $pro->update($data);

        return response()->json([
            'message' => 'Province updated successfully',
            'province' => $province,
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $province = provinces::find($id);
        $province->delete();

        return response()->json([
            'message' => 'Province deleted successfully',
        ]);
    }
}
