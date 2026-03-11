<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return OrderItem::with('order.user','product')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $orderItem = OrderItem::create($request->all());
        return response()->json($orderItem, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(OrderItem $orderItem)
    {
        $orderItem->loads('order.user', 'product');
        return response()->json($orderItem);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, OrderItem $orderItem)
    {
        $orderItem->update($request->all());
        return response()->json($orderItem);    
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OrderItem $orderItem)
    {
        $orderItem->delete();
        return response()->json(null, 204);
    }
}
