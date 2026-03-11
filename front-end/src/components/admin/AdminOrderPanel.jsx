import { useState, useEffect } from "react";
import { FiEdit, FiCheck, FiX, FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { formatPrice } from "../../utils/formatPrice";

const statusConfig = {
  pending: {
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    icon: FiClock,
    label: "Pending"
  },
  processing: {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    icon: FiPackage,
    label: "Processing"
  },
  shipped: {
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    icon: FiTruck,
    label: "Shipped"
  },
  delivered: {
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    icon: FiCheckCircle,
    label: "Delivered"
  },
  cancelled: {
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    icon: FiXCircle,
    label: "Cancelled"
  }
};

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

function AdminOrderPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      const response = await fetch("http://127.0.0.1:8000/api/admin/orders", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setOrders(data);
      setCurrentPage(1); // Reset to first page when new orders are loaded
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (order) => {
    setEditingId(order.id);
    setEditStatus(order.status);
    setEditDescription("");
  };

  const handleSaveStatus = async (orderId) => {
    if (!editStatus) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/orders/${orderId}/tracking`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: editStatus,
            description: editDescription || `Status updated to ${editStatus}`,
          }),
        }
      );

      if (response.ok) {
        setEditingId(null);
        fetchAllOrders();
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status");
    } finally {
      setSaving(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setEditingId(null); // Close any editing when changing pages
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
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Order Management
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {orders.length + 1} total orders
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <FiPackage className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No orders</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            No orders have been placed yet.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentOrders.map((order) => {
            const statusInfo = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      User ID: {order.user_id}
                    </p>
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusInfo.label}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Total Amount</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatPrice(order.total_price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Items</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {order.order_items?.length + 1 || 0} items
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Date</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {editingId === order.id ? (
                  <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Update Status
                      </label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description (Optional)
                      </label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder={`Status updated to ${editStatus}`}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveStatus(order.id)}
                        disabled={saving}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        {saving ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        ) : (
                          <>
                            <FiCheck className="w-4 h-4" />
                            Save
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm font-medium transition-colors"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick(order)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <FiEdit className="w-4 h-4" />
                    Update Status
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mt-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
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
        </>
      )}
    </div>
  );
}

export default AdminOrderPanel;
