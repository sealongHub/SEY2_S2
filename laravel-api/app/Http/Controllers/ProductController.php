<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Support\Facades\Storage;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // 🎯 ប្រមូលយក Filters ពី Request
        $filters = $request->only(['text_search', 'status', 'category_id', 'brand_id']);

        // 🧠 បង្កើត Query សម្រាប់ទាញយកផលិតផល (ជាមួយ Category និង Brand របស់វា)
        $query = Product::with(['category:id,name', 'brand:id,name'])
            ->select('id', 'name', 'code', 'price', 'quantity', 'category_id', 'brand_id', 'status', 'image', 'created_at')
            ->when($filters['text_search'] ?? null, fn($q, $v) =>
                $q->where(fn($sub) =>
                    $sub->where('name', 'like', "%$v%")
                        ->orWhere('code', 'like', "%$v%")
                )
            )
            ->when($filters['status'] ?? null, fn($q, $v) => $q->where('status', $v))
            ->when($filters['category_id'] ?? null, fn($q, $v) => $q->where('category_id', $v))
            ->when($filters['brand_id'] ?? null, fn($q, $v) => $q->where('brand_id', $v))
            ->latest('id');

        // ⚡ ប្រើ simplePaginate សម្រាប់ល្បឿនលឿន (បង្ហាញទំព័រ ១០ ក្នុងមួយទំព័រ)
        $products = $query->simplePaginate(10);

        // ✅ ទាញយក Category និង Brand ផ្ទាល់ពី Database (ដោយមិនប្រើ Cache)
        $category = Category::select('id', 'name')->orderBy('name')->get();
        $brand = Brand::select('id', 'name')->orderBy('name')->get();

        // 🚀 បញ្ជូន JSON Response ត្រឡប់ទៅឱ្យ Frontend
        return response()->json([
            'proList' => $products->items(),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'next_page_url' => $products->nextPageUrl(),
                'prev_page_url' => $products->previousPageUrl(),
                'per_page' => $products->perPage(),
            ],
            'category' => $category,
            'brand' => $brand,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'code' => 'required|unique:products,code',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'quantity' => 'nullable|integer',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'status' => 'required|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = $request->all();
        $data['quantity'] = $request->input('quantity', 0);

        // ✅ កែប្រែ៖ Upload ទៅ Cloudinary
        if($request->hasFile('image')){
            $result = Cloudinary::upload($request->file('image')->getRealPath(), [
                'folder' => 'long_store_image'
            ]);
            $data['image'] = $result->getSecurePath(); // រក្សាទុក URL ពេញ
        }

        $product = Product::create($data);

        return response()->json([
            'message' => 'Product created successfully',
            'data' => $product,
        ]); 
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $pro = Product::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:100',
            'code' => 'required|unique:products,code,'.$id,
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'quantity' => 'nullable|integer',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'status' => 'required|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = $request->all();

        if($request->hasFile('image')){
            // ✅ កែប្រែ៖ លុបរូបចាស់ពី Cloudinary (ប្រសិនបើជា URL)
            if($pro->image && str_contains($pro->image, 'cloudinary')){
                $publicId = 'long_store_image/' . pathinfo(parse_url($pro->image, PHP_URL_PATH), PATHINFO_FILENAME);
                Cloudinary::destroy($publicId);
            }
            
            // Upload រូបថ្មី
            $result = Cloudinary::upload($request->file('image')->getRealPath(), [
                'folder' => 'long_store_image'
            ]);
            $data['image'] = $result->getSecurePath();
        }

        // ប្រសិនបើ User ចុច remove រូបភាព
        if($request->filled('image_remove') && $request->image_remove == true){
            if($pro->image && str_contains($pro->image, 'cloudinary')){
                $publicId = 'long_store_image/' . pathinfo(parse_url($pro->image, PHP_URL_PATH), PATHINFO_FILENAME);
                Cloudinary::destroy($publicId); // លុបចេញពី Cloudinary
            }
            $data['image'] = null;
        }

        $pro->update($data);

        return response()->json([
            'message' => 'Product updated successfully',
            'data' => $pro,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $pro = Product::findOrFail($id);

        // ✅ កែប្រែ៖ លុបរូបភាពពី Cloudinary មុននឹងលុបទិន្នន័យ
        if($pro->image && str_contains($pro->image, 'cloudinary')){
            $publicId = 'long_store_image/' . pathinfo(parse_url($pro->image, PHP_URL_PATH), PATHINFO_FILENAME);
            Cloudinary::destroy($publicId);
        }

        $pro->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
        ]);  
    }
}