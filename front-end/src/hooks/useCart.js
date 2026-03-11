import { useEffect, useMemo, useRef, useState } from "react";

export const useCart = () => {
  const [cart, setCart] = useState([]);
  const [cartNotification, setCartNotification] = useState("");
  const notificationTimerRef = useRef(null);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  }, [cart]);

  const setAddedToCartNotification = (productName) => {
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
    }

    setCartNotification(`${productName} added to cart!`);

    notificationTimerRef.current = setTimeout(() => {
      setCartNotification("");
      notificationTimerRef.current = null;
    }, 3000);
  };

  const addToCart = (product) => {
    setCart((previous) => {
      const existing = previous.find((item) => item.id === product.id);

      if (existing) {
        return previous.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...previous, { ...product, quantity: 1 }];
    });

    setAddedToCartNotification(product.name);
  };

  const removeFromCart = (productId) => {
    setCart((previous) => previous.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((previous) =>
      previous.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  useEffect(() => {
    return () => {
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current);
      }
    };
  }, []);

  return {
    cart,
    cartNotification,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};