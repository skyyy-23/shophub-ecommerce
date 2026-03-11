import { useState, useEffect } from "react";

export const useOrders = (userId) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserOrders = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/orders`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const getOrderTracking = async (orderId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/orders/${orderId}/tracking`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tracking");
      }
      return await response.json();
    } catch (err) {
      console.error("Failed to fetch tracking:", err);
      throw err;
    }
  };

  const updateOrderStatus = async (orderId, status, description) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/orders/${orderId}/tracking`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, description }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      const data = await response.json();
      // Update the local orders list
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, ...data.order } : order
        )
      );
      return data;
    } catch (err) {
      console.error("Failed to update order status:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [userId]);

  return {
    orders,
    loading,
    error,
    fetchUserOrders,
    getOrderTracking,
    updateOrderStatus,
  };
};
