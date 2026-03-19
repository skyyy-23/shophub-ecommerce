<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Product::all());
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
            $data['image'] = $this->storeProductImage($request);
        }

        $product = Product::create($data);

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
            $this->deleteProductImage($product->image);
            $data['image'] = $this->storeProductImage($request);
        }

        $product->update($data);
        return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $this->deleteProductImage($product->image);
        $product->delete();
        return response()->noContent();
    }

    private function storeProductImage(Request $request): string
    {
        $imagePath = $request->file('image')->store('products', 'public');

        return url(Storage::url($imagePath));
    }

    private function deleteProductImage(?string $imageUrl): void
    {
        $storagePath = $this->resolveStoragePath($imageUrl);

        if ($storagePath && Storage::disk('public')->exists($storagePath)) {
            Storage::disk('public')->delete($storagePath);
        }
    }

    private function resolveStoragePath(?string $imageUrl): ?string
    {
        if (! $imageUrl) {
            return null;
        }

        $path = parse_url($imageUrl, PHP_URL_PATH) ?: $imageUrl;
        $normalizedPath = ltrim($path, '/');

        if (str_starts_with($normalizedPath, 'storage/')) {
            return substr($normalizedPath, strlen('storage/'));
        }

        return $normalizedPath;
    }
}
