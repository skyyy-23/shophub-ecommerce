<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {   
        $products = Product::all();
        return response()->json($products)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
            ->header('Access-Control-Allow-Headers', 'Content-Type');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price' => 'required|numeric',
        'stock' => 'required|integer',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240'
    ]);

        $data = $validated;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            $data['image'] = env('APP_URL') . '/storage/' . $imagePath;
            \Log::info('Image saved: ' . $data['image']);
        }

        $product = Product::create($data);
        \Log::info('Product created:', $product->toArray());
        return response()->json($product, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return $product;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price' => 'required|numeric',
        'stock' => 'required|integer',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240'
    ]);

        $data = $validated;

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image) {
                $oldImagePath = str_replace(env('APP_URL'), '', $product->image);
                if (file_exists(public_path($oldImagePath))) {
                    unlink(public_path($oldImagePath));
                }
            }
            $imagePath = $request->file('image')->store('products', 'public');
            $data['image'] = env('APP_URL') . '/storage/' . $imagePath;
        }

        $product->update($data);
        return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json([
            'message' => 'Product deleted successfully'
            ], 204);
    }
}
