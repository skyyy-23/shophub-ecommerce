import { FiShoppingBag, FiShoppingCart, FiTrash2, FiX } from "react-icons/fi";
import Spinner from "../common/Spinner";
import { formatPrice } from "../../utils/formatPrice";

function CartSidebar({
  variant = "sidebar",
  showCart,
  cart,
  total,
  isPlacingOrder,
  onClose,
  onRemoveItem,
  onUpdateQuantity,
  onPlaceOrder,
  onClearCart,
}) {
  const isInline = variant === "inline";

  if (isInline && !showCart) {
    return null;
  }

  const containerClasses = isInline
    ? "relative w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 flex flex-col h-[100vh] overflow-hidden text-sm sm:text-base"
    : "relative w-full md:w-96 bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 flex flex-col md:max-h-screen overflow-hidden text-sm sm:text-base";

  return (
    <aside
      className={containerClasses}
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">
          <FiShoppingCart className="inline mr-2" />
          Shopping Cart
        </h2>

        <button
          onClick={onClose}
          disabled={isPlacingOrder}
          className={`${isInline ? "" : "md:hidden"} p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          <FiX />
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-10 sm:py-12 text-gray-600 dark:text-gray-400">
          <p className="text-3xl sm:text-4xl mb-2">
            <FiShoppingBag className="inline" />
          </p>
          <p className="text-base sm:text-lg">Your cart is empty</p>
          <p className="text-xs sm:text-sm mt-2">Add products to get started!</p>
        </div>
      ) : (
        <>
          <div className="scroll-bar flex-1 overflow-y-auto space-y-3 sm:space-y-4 mb-4 sm:mb-6 pr-1">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white leading-snug">{item.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{formatPrice(item.price)}</p>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    disabled={isPlacingOrder}
                    className="text-red-500 hover:text-red-700 font-bold disabled:text-red-300 disabled:cursor-not-allowed"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <div className="flex items-center gap-2 w-full">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={isPlacingOrder}
                    className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold w-9 h-9 rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    -
                  </button>

                  <span className="flex-1 text-center font-semibold text-gray-800 dark:text-white">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={isPlacingOrder}
                    className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold w-9 h-9 rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    +
                  </button>

                  <span className="text-right font-bold text-blue-600 dark:text-blue-400 min-w-20 text-sm sm:text-base">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-300 dark:border-gray-600 pt-4 sm:pt-6 space-y-4">
            <div className="flex items-center justify-between text-base sm:text-lg">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Subtotal:</span>
              <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatPrice(total)}
              </span>
            </div>
              <div className="flex gap-3">
                <button
                  onClick={onPlaceOrder}
                  disabled={cart.length === 0 || isPlacingOrder}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-2.5 sm:py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg disabled:cursor-not-allowed"
                >
                  {isPlacingOrder ? (
                    <>
                      <Spinner sizeClass="h-4 w-4" />
                      Placing Order...
                    </>
                  ) : (
                    <>Place Order</>
                  )}
                </button>
                
                <button
                  onClick={onClearCart}
                  disabled={isPlacingOrder}
                  className="w-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-semibold py-2.5 sm:py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Clear Cart
                </button>
              </div>
          </div>
        </>
      )}
    </aside>
  );
}

export default CartSidebar;
