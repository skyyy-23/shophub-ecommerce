import { useEffect, useState } from "react";
import CartSidebar from "./components/cart/CartSidebar";
import CartNotification from "./components/common/CartNotification";
import AppHeader from "./components/layout/AppHeader";
import ProductGrid from "./components/products/ProductGrid";
import ProductModal from "./components/products/ProductModal";
import OrderHistory from "./components/orders/OrderHistory";
import AdminOrderPanel from "./components/admin/AdminOrderPanel";
import LoginModal from "./components/auth/LoginModal";
import RegisterModal from "./components/auth/RegisterModal";
import { useCart } from "./hooks/useCart";
import { useDarkMode } from "./hooks/useDarkMode";
import { useProducts } from "./hooks/useProducts";
import { useAuth } from "./hooks/useAuth";
import { createOrder } from "./services/shopApi";
import { getAuthToken } from "./services/authStorage";

function App() {
  const [showCart, setShowCart] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [activeTab, setActiveTab] = useState("products"); // "products", "orders", "admin"
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [showAdminRegisterModal, setShowAdminRegisterModal] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { user, login, logout, isAdmin } = useAuth();

  useEffect(() => {
    if (!user && activeTab !== "products") {
      setActiveTab("products");
      return;
    }

    if (!isAdmin && activeTab === "admin") {
      setActiveTab("products");
    }
  }, [user, isAdmin, activeTab]);

  const {
    products,
    form,
    editingId,
    showModal,
    isFetchingProducts,
    isSubmittingProduct,
    deletingProductId,
    handleFormChange,
    openCreateModal,
    openEditModal,
    closeModal,
    submitProduct,
    removeProduct,
    decreaseStocksAfterOrder,
  } = useProducts();

  const {
    cart,
    cartNotification,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const handleAddToCart = (product) => {
    if (!user) {
      alert("Please log in to add items to your cart.");
      setShowLoginModal(true);
      return;
    }
    addToCart(product);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0 || isPlacingOrder || !user) {
      return;
    }

    const payload = {
      user_id: user.id,
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };

    setIsPlacingOrder(true);

    try {
      const token = getAuthToken();
      await createOrder(payload, token);
      decreaseStocksAfterOrder(cart);
      alert("Order placed!");
      clearCart();
    } catch (error) {
      console.error("Failed to place order:", error.response?.data || error.message);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 font-sans bg-gray-50 dark:bg-gray-900">
      <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 -z-10" />

      <AppHeader
        darkMode={darkMode}
        cartCount={cart.length}
        user={user}
        onOpenAddProduct={openCreateModal}
        onToggleCart={() => setShowCart((previous) => !previous)}
        onToggleTheme={toggleDarkMode}
        onLogin={() => setShowLoginModal(true)}
        onAdminLogin={() => setShowAdminLoginModal(true)}
        onLogout={logout}
      />

      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 my-1">
          <CartNotification message={cartNotification} />

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === "products"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              Products
            </button>

            {user && !isAdmin && (
            <button onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === "orders"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              My Orders
            </button>
            )}

            {isAdmin && (
              <button onClick={() => setActiveTab("admin")}
                className={`px-4 py-2 font-semibold transition-colors ${
                  activeTab === "admin"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                Admin Panel
              </button>
            )}
          </div>

          <ProductModal
            show={showModal}
            editingId={editingId}
            form={form}
            isSubmitting={isSubmittingProduct}
            isAdmin={isAdmin}
            onChange={handleFormChange}
            onClose={closeModal}
            onSubmit={submitProduct}
          />

          <div className={isAdmin ? "grid grid-cols-1 gap-8" : "grid grid-cols-1 lg:grid-cols-3 gap-8"}>
            {activeTab === "products" && (
              <>
                <div className={isAdmin ? "lg:col-span-2" : "lg:col-span-2"}> 
                    <ProductGrid
                    products={products}
                    isFetching={isFetchingProducts}
                    deletingProductId={deletingProductId}
                    onEdit={isAdmin ? openEditModal : undefined}
                    onDelete={isAdmin ? removeProduct : undefined}
                    onAddToCart={handleAddToCart}
                    isAdmin={isAdmin}
                  />
                  </div>
                {!isAdmin && (
                  <CartSidebar
                    showCart={showCart}
                    cart={cart}
                    total={total}
                    isPlacingOrder={isPlacingOrder}
                    onClose={() => setShowCart(false)}
                    onRemoveItem={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                    onPlaceOrder={handlePlaceOrder}
                    onClearCart={clearCart}
                    isAdmin={isAdmin}
                  />
                )}
              </>
            )}

            {activeTab === "orders" && !isAdmin && (
              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <OrderHistory userId={user?.id} />
                </div>
              </div>
            )}

            {activeTab === "admin" && isAdmin && (
              <div className="lg:col-span-3">
                <AdminOrderPanel />
              </div>
            )}
          </div>

          {/* Authentication Modals */}
          <LoginModal
            show={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLogin={(session) => {
              login(session);
              if (session?.user?.role === "admin") {
                setActiveTab("admin");
              }
            }}
            onSwitchToRegister={() => {
              setShowLoginModal(false);
              setShowRegisterModal(true);
            }}
          />

          <LoginModal
            show={showAdminLoginModal}
            mode="admin"
            onClose={() => setShowAdminLoginModal(false)}
            onLogin={(session) => {
              login(session);
              if (session?.user?.role === "admin") {
                setActiveTab("admin");
              }
            }}
            onSwitchToRegister={() => {
              setShowAdminLoginModal(false);
              setShowAdminRegisterModal(true);
            }}
          />

          <RegisterModal
            show={showRegisterModal}
            onClose={() => setShowRegisterModal(false)}
            onRegister={login}
            onSwitchToLogin={() => {
              setShowRegisterModal(false);
              setShowLoginModal(true);
            }}
          />

          <RegisterModal
            show={showAdminRegisterModal}
            mode="admin"
            onClose={() => setShowAdminRegisterModal(false)}
            onRegister={login}
            onSwitchToLogin={() => {
              setShowAdminRegisterModal(false);
              setShowAdminLoginModal(true);
            }}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
