import Spinner from "../common/Spinner";
import ProductCard from "./ProductCard";

function ProductGrid({
  products,
  isFetching,
  deletingProductId,
  onEdit,
  onDelete,
  onAddToCart,
  isAdmin = false,
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Products</h2>

        {isFetching && (
          <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
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
        <div className="overflow-auto h-[65vh]">
        <div className="overflow-auto h-[100%]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-5">
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
        </div>
      )}
    </section>
  );
}

export default ProductGrid;
