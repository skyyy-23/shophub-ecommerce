import { FiBox, FiEdit3, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import Spinner from "../common/Spinner";
import { formatPrice } from "../../utils/formatPrice";

const getStockBadgeClass = (stock) => {
  if (stock > 10) {
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
  }

  if (stock > 5) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  }

  return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
};

function ProductCard({
  product,
  isAdmin = false,
  isDeleting,
  disableProductActions,
  onEdit,
  onDelete,
  onAddToCart,
}) {
  const stock = Number(product.stock) || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden group">
      <div className="h-32 sm:h-36 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <FiBox />
        )}
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-1 leading-snug">
          {product.name}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2 leading-snug">
          {product.description}
        </p>

        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
            {formatPrice(product.price)}
          </span>

          <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ${getStockBadgeClass(stock)}`}>
            {stock} stock
          </span>
        </div>

        <div className="flex gap-2">
          {isAdmin && (
            <>
              <button
                onClick={() => onEdit?.(product)}
                disabled={disableProductActions}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white text-xs sm:text-sm font-semibold py-1.5 rounded transition-colors flex items-center justify-center gap-1 disabled:cursor-not-allowed"
              >
                <FiEdit3 />
                Edit
              </button>

              <button
                onClick={() => onDelete?.(product.id)}
                disabled={disableProductActions}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white text-xs sm:text-sm font-semibold py-1.5 px-1 rounded transition-colors flex items-center justify-center gap-1 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <Spinner sizeClass="h-3 w-3" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 />
                    Delete
                  </>
                )}
              </button>
            </>
          )}

          <button
            onClick={() => onAddToCart(product)}
            disabled={stock <= 0 || isDeleting}
            className={`flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white text-xs sm:text-sm font-semibold py-1.5 px-1 rounded transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-1 ${isAdmin ? '' : 'w-full'}`}
          >
            <FiShoppingCart />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
