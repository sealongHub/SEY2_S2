<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    // ទាញយកទិន្នន័យទាំងអស់ (ជាមួយ Pagination ឬ Search)
    public function index(Request $request)
    {
        $query = Supplier::query();
        if ($request->text_search) {
            $query->where('name', 'like', "%{$request->text_search}%");
        }
        $list = $query->orderBy('id', 'desc')->get();
        return response()->json(['list' => $list]);
    }

    // រក្សាទុកទិន្នន័យថ្មី
    public function store(Request $request)
    {
        $request->validate(['name' => 'required']);
        $supplier = Supplier::create($request->all());
        return response()->json(['data' => $supplier, 'message' => 'រក្សាទុកជោគជ័យ']);
    }

    // កែប្រែទិន្នន័យ
    public function update(Request $request, $id)
    {
        $supplier = Supplier::find($id);
        $supplier->update($request->all());
        return response()->json(['message' => 'កែប្រែជោគជ័យ']);
    }

    // លុបទិន្នន័យ
    public function destroy($id)
    {
        Supplier::destroy($id);
        return response()->json(['message' => 'លុបជោគជ័យ']);
    }
}