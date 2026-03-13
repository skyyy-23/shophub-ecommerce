import Spinner from "../common/Spinner";
import ProductCard from "./ProductCard";

function ProductGrid({
  products,
  isFetching,
  deletingProductId,
  onEdit,
  onDelete,
  onAddToCart,
  isAdmin = true,
}) {
  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white leading-tight">
          Products
        </h2>

        {isFetching && (
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            <Spinner sizeClass="h-4 w-4" />
            Loading products...
          </div>
        )}
      </div>

      {isFetching && products.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
          <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 text-lg">
            <Spinner sizeClass="h-5 w-5" />
            Loading products...
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No products yet. Add one to get started!
          </p>
        </div>
      ) : (
        <div className="overflow-visible md:overflow-auto md:max-h-[70vh]">
          <div
            className={`grid ${isAdmin? "lg:grid-cols-5":"lg:grid-cols-3"} ${isAdmin ? "md:grid-cols-5" : "md:grid-cols-3"} gap-3 sm:gap-4 p-2 sm:p-4`}
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isAdmin={isAdmin}
                isDeleting={deletingProductId === product.id}
                disableProductActions={deletingProductId !== null}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductGrid;
