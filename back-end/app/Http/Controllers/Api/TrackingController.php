<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderTracking;
use Illuminate\Http\Request;

class TrackingController extends Controller
{
    // Get tracking history for an order
    public function show(Request $request, Order $order)
    {
        $this->authorizeOrderAccess($request, $order);
        $order->load('tracking');

        return response()->json([
            'order_id' => $order->id,
            'status' => $order->status,
            'total_price' => $order->total_price,
            'created_at' => $order->created_at,
            'tracking' => $order->tracking,
        ]);
    }

    // Get all user orders with tracking
    public function userOrders(Request $request, $userId)
    {
        $isAdmin = $request->user()?->role === 'admin';

        if (! $isAdmin && (int) $request->user()?->id !== (int) $userId) {
            abort(403, 'You are not authorized to view these orders.');
        }

        $orders = Order::where('user_id', $userId)
            ->with('tracking', 'orderItems.product')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    // Update order status and create tracking record
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
            'description' => 'nullable|string',
        ]);

        $order->update(['status' => $validated['status']]);

        OrderTracking::create([
            'order_id' => $order->id,
            'status' => $validated['status'],
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json([
            'message' => 'Order status updated',
            'order' => $order->load('tracking'),
        ]);
    }

    private function authorizeOrderAccess(Request $request, Order $order): void
    {
        $isAdmin = $request->user()?->role === 'admin';

        if (! $isAdmin && $request->user()?->id !== $order->user_id) {
            abort(403, 'You are not authorized to view this order.');
        }
    }
}
