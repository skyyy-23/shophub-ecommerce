import { FiX } from "react-icons/fi";
import Spinner from "../common/Spinner";

function ProductModal({
  show,
  editingId,
  form,
  isSubmitting,
  isAdmin = false,
  onChange,
  onClose,
  onSubmit,
}) {
  if (!show || !isAdmin) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => {
            if (!isSubmitting) {
              onClose();
            }
          }}
        />

        <div className="relative w-full max-w-2xl mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-black dark:text-white">
                {editingId ? "Edit Product" : "Add Product"}
              </h3>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label="Close"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={onChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              />

              <input
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={onChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              />

              <input
                name="price"
                placeholder="Price (PHP)"
                type="number"
                step="0.01"
                value={form.price}
                onChange={onChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              />

              <input
                name="stock"
                placeholder="Stock"
                type="number"
                value={form.stock}
                onChange={onChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              />

              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={onChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />

              <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner sizeClass="h-4 w-4" />
                      {editingId ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>{editingId ? "Update" : "Add Product"}</>
                  )}
                </button>
              </div>
            </form>
           </div>
          </div>
        </div>
    </section>
  );
}

export default ProductModal;
