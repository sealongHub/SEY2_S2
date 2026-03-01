<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Role::query();

        if($request->has('text_search')){
            $query->where('name', "like", "%".$request->input('text_search')."%");
        }

        if($request->has('status')){
            $query->where('status', "=", $request->input('status'));
        }

        $list = $query->get();

        $role = Role::all();

        return response()->json([
            "message" => "Get Role",
            "list" => $role,
            "list" => $list,
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
        //create new instance form model class
        // $role = new Role;        

        // $role->name = $request->input('name');
        // $role->code = $request->input('code');
        // $role->description = $request->input('description');
        // $role->status = $request->input('status');
        // $role->save();

        $validate = $request->validate([
            'name' => 'required|string|max:50',
            'code' => 'required|string|max:20',
            'description' => 'required|string|max:100',
            'status' => 'required|boolean',
        ]);

        $validate = Role::create([
            'name' => $request->name,
            'code' => $request->code,
            'description' => $request->description,
            'status' => $request->status,
        ]);

        return response()->json([
            "message" => 'Insert Role Successfully',
            'roles' => $validate,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        
        $role = Role::find($id);

        if(!$role){
            return response()->json([
                "message" => "This record not Found in system"
            ]);
        }

        return response()->json([
            'message' => $role

        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $role = Role::find($id);

        $request->validate([
            'name' => 'required|string|max:50',
            'code' => 'required|string|max:20',
            'description' => 'required|string|max:100',
            'status' => 'required|boolean',
        ]);

        $data = $request->all();

        $role->update($data);

        return response()->json([
            'message' => 'Update Successfully',
            'update' => $role
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $role = Role::find($id);

        if(!$role){
            return response()->json([
                "message" => "This record not Found in system"
            ]);
        }
        $role->delete();

        return response()->json([
            "message" => "Delete Successfully",
            'delete' => $role
        ]);
    }
}
