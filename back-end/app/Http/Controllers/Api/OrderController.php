<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderTracking;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Order::with('orderItems.product', 'user', 'tracking')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $order = DB::transaction(function () use ($validated) {
            $totalPrice = 0;

            $order = Order::create([
                'user_id' => $validated['user_id'],
                'total_price' => 0,
                'status' => 'pending',
            ]);

            foreach ($validated['items'] as $item) {
                $product = Product::lockForUpdate()->find($item['product_id']);

                if (! $product) {
                    throw ValidationException::withMessages([
                        'items' => ['One or more products are no longer available.'],
                    ]);
                }

                $quantity = (int) $item['quantity'];

                if ($product->stock < $quantity) {
                    throw ValidationException::withMessages([
                        'items' => ["Insufficient stock for {$product->name}. Available: {$product->stock}, requested: {$quantity}."],
                    ]);
                }

                $totalPrice += $product->price * $quantity;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $product->price,
                ]);

                $product->decrement('stock', $quantity);
            }

            $order->update([
                'total_price' => $totalPrice,
            ]);

            // Create initial tracking record
            OrderTracking::create([
                'order_id' => $order->id,
                'status' => 'pending',
                'description' => 'Order placed',
            ]);

            return $order->load('orderItems.product', 'user', 'tracking');
        });

        return response()->json($order, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        $order->load('orderItems.product', 'user');

        return response()->json($order);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        $order->update($request->all());

        return response()->json($order);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        $order->delete();

        return response()->json(null, 204);
    }
}