import { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../services/shopApi";
import { getAuthToken } from "../services/authStorage";

const initialForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  image: null,
};

const toFormState = (product) => ({
  name: product?.name ?? "",
  description: product?.description ?? "",
  price: product?.price ?? "",
  stock: product?.stock ?? "",
  image: null, // Reset file on edit
});

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);

  const refreshProducts = async () => {
    setIsFetchingProducts(true);

    try {
      const data = await fetchProducts();
      console.log("Fetched products:", data);
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error.response?.data || error.message);
    } finally {
      setIsFetchingProducts(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const handleFormChange = (event) => {
    const { name, value, type, files } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setForm(toFormState(product));
    setEditingId(product.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const submitProduct = async (event) => {
    event.preventDefault();

    if (isSubmittingProduct) {
      return;
    }

    setIsSubmittingProduct(true);

    try {
      const token = getAuthToken();
      if (editingId) {
        await updateProduct(editingId, form, token);
      } else {
        await createProduct(form, token);
      }

      await refreshProducts();
      closeModal();
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.message) {
        alert("Validation Error: " + errorData.message);
      } else if (errorData?.errors) {
        const errorMessages = Object.values(errorData.errors)
          .flat()
          .join("\n");
        alert("Upload Failed:\n" + errorMessages);
      } else {
        alert("Failed to save product: " + error.message);
      }
      console.error("Failed to save product:", errorData || error.message);
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const removeProduct = async (productId) => {
    if (deletingProductId !== null) {
      return;
    }

    setDeletingProductId(productId);

    try {
      const token = getAuthToken();
      await deleteProduct(productId, token);
      await refreshProducts();
    } catch (error) {
      console.error("Failed to delete product:", error.response?.data || error.message);
    } finally {
      setDeletingProductId(null);
    }
  };

  const decreaseStocksAfterOrder = (cartItems) => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return;
    }

    const quantitiesByProductId = new Map(
      cartItems.map((item) => [item.id, Number(item.quantity) || 0])
    );

    setProducts((previous) =>
      previous.map((product) => {
        if (!quantitiesByProductId.has(product.id)) {
          return product;
        }

        const currentStock = Number(product.stock) || 0;
        const deductedStock = quantitiesByProductId.get(product.id);
        const nextStock = Math.max(currentStock - deductedStock, 0);

        return {
          ...product,
          stock: nextStock,
        };
      })
    );
  };

  return {
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
  };
};
