import { useState, useEffect } from "react";
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiChevronDown, FiChevronUp, FiShoppingBag, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { formatPrice } from "../../utils/formatPrice";
import { apiEndpoints } from "../../config/api";
import { getAuthToken } from "../../services/authStorage";

const statusConfig = {
  pending: {
    color: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white",
    icon: FiClock,
    label: "Pending",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  processing: {
    color: "bg-gradient-to-r from-blue-400 to-blue-500 text-white",
    icon: FiPackage,
    label: "Processing",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  shipped: {
    color: "bg-gradient-to-r from-purple-400 to-purple-500 text-white",
    icon: FiTruck,
    label: "Shipped",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  delivered: {
    color: "bg-gradient-to-r from-green-400 to-green-500 text-white",
    icon: FiCheckCircle,
    label: "Delivered",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  cancelled: {
    color: "bg-gradient-to-r from-red-400 to-red-500 text-white",
    icon: FiClock,
    label: "Cancelled",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
};

function OrderHistory({ userId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUserOrders();
  }, [userId]);

  const fetchUserOrders = async () => {
    try {
      if (!userId) {
        setOrders([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const token = getAuthToken();
      const response = await fetch(
        apiEndpoints.userOrders(userId),
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setOrders(data);
      setCurrentPage(1); // Reset to first page when new orders are loaded
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Pagination logic
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setExpandedOrder(null); // Close any expanded orders when changing pages
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center p-12">
        <div className="bg-gradient-to-br from-blue-400 to-purple-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiShoppingBag className="text-white text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No orders yet</h3>
        <p className="text-gray-600 dark:text-gray-400">Start shopping to see your order history here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">My Orders</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Track and manage your purchases</p>
      </div>

      {currentOrders.map((order) => {
        const config = statusConfig[order.status] || statusConfig.pending;
        const StatusIcon = config.icon;
        const isExpanded = expandedOrder === order.id;
        const itemCount = Array.isArray(order.order_items)
          ? order.order_items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
          : 0;

        return (
          <div
            key={order.id}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border ${config.borderColor} overflow-hidden`}
          >
            {/* Order Header */}
            <div
              className={`p-4 sm:p-6 cursor-pointer ${config.bgColor} transition-colors`}
              onClick={() => toggleOrderExpansion(order.id)}
            >
              <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 sm:p-3 rounded-full ${config.color} shadow-lg`}>
                    <StatusIcon className="text-xl" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        Order #{order.id}
                      </h3>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${config.color} shadow-sm`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2 sm:flex-row sm:gap-4">
                  <div className="text-left sm:text-right">
                    <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(order.total_price)}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {itemCount} item{itemCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className={`p-2 rounded-full transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                    <FiChevronDown className="text-gray-500 dark:text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            {isExpanded && (
              <div className="px-4 sm:px-6 pb-6 space-y-5 sm:space-y-6">
                {/* Order Items */}
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <FiShoppingBag className="text-blue-500" />
                    Order Items
                  </h4>
                  <div className="space-y-3">
                    {order.order_items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {item.product?.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                              <FiPackage className="text-white text-sm" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                              {item.product?.name}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-bold text-blue-600 dark:text-blue-400 text-sm sm:text-base">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {formatPrice(item.price)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tracking Timeline */}
                {order.tracking && order.tracking.length > 0 && (
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                      <FiTruck className="text-blue-500" />
                      Order Tracking
                    </h4>
                    <div className="space-y-4">
                      {order.tracking.map((track, index) => {
                        const trackConfig = statusConfig[track.status] || statusConfig.pending;
                        const TrackIcon = trackConfig.icon;

                        return (
                          <div key={track.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`p-2 rounded-full ${trackConfig.color} shadow-lg`}>
                                <TrackIcon className="text-lg" />
                              </div>
                              {index < order.tracking.length - 1 && (
                                <div className="w-0.5 h-8 bg-gradient-to-b from-blue-300 to-blue-100 dark:from-blue-600 dark:to-blue-800 my-2 rounded-full" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
                                <p className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">
                                  {trackConfig.label}
                                </p>
                                {track.description && (
                                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2">
                                    {track.description}
                                  </p>
                                )}
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(track.created_at).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mt-6 sm:mt-8">
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, orders.length)} of {orders.length} orders
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show first page, last page, current page, and pages around current
                  return page === 1 ||
                         page === totalPages ||
                         (page >= currentPage - 1 && page <= currentPage + 1);
                })
                .map((page, index, array) => {
                  // Add ellipsis if there are gaps
                  const prevPage = array[index - 1];
                  if (prevPage && page - prevPage > 1) {
                    return (
                      <span key={`ellipsis-${page}`} className="px-3 py-2 text-gray-400">
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
