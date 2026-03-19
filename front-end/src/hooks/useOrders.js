import { useEffect, useEffectEvent, useState } from "react";
import {
  fetchOrderTracking,
  fetchUserOrders as fetchUserOrdersRequest,
  updateOrderTracking,
} from "../services/shopApi";

export const useOrders = (userId) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserOrders = async () => {
    if (!userId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchUserOrdersRequest(userId);
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
      return await fetchOrderTracking(orderId);
    } catch (err) {
      console.error("Failed to fetch tracking:", err);
      throw err;
    }
  };

  const updateOrderStatus = async (orderId, status, description) => {
    try {
      const data = await updateOrderTracking(orderId, { status, description });
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

  const syncOrders = useEffectEvent(() => {
    void fetchUserOrders();
  });

  useEffect(() => {
    syncOrders();
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
