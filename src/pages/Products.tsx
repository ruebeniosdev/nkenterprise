import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  RefreshCw,
  X,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState(""); // New: Inline status message
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    product_name: "",
    category_id: "",
    supplier_id: "",
    unit_price: "",
    quantity_in_stock: "",
    reorder_level: "",
    barcode: "",
  });

  const baseUrl = "https://e0381ad6b58d.ngrok-free.app/api";
  const token = localStorage.getItem("authToken");

  // Fetch products
  const fetchProducts = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${baseUrl}/products`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        mode: "cors",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }
      const data = await response.json();
      if (data.success) setProducts(data.data || []);
      else setError(data.message || "Failed to load products");
    } catch (err) {
      setError(`Connection error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories & suppliers
  const fetchMetadata = async () => {
    try {
      const [categoriesRes, suppliersRes] = await Promise.all([
        fetch(`${baseUrl}/categories`, {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }),
        fetch(`${baseUrl}/suppliers`, {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }),
      ]);
      const categoriesData = await categoriesRes.json();
      const suppliersData = await suppliersRes.json();
      if (categoriesData.success) setCategories(categoriesData.data || []);
      if (suppliersData.success) setSuppliers(suppliersData.data || []);
    } catch (err) {
      console.error("Error fetching metadata:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchMetadata();
  }, []);

  // Save product (create or update) — inline status messages
  const handleSaveProduct = async () => {
    if (
      !formData.product_name ||
      !formData.category_id ||
      !formData.supplier_id ||
      !formData.unit_price ||
      !formData.quantity_in_stock ||
      !formData.reorder_level ||
      !formData.barcode
    ) {
      setStatusMessage("Please fill all fields.");
      setTimeout(() => setStatusMessage(""), 3000);
      return;
    }

    if (parseFloat(formData.unit_price) <= 0) {
      setStatusMessage("Price must be positive.");
      setTimeout(() => setStatusMessage(""), 3000);
      return;
    }

    setIsLoading(true);
    setStatusMessage("");

    try {
      const url = editingProduct
        ? `${baseUrl}/products/${editingProduct.product_id}`
        : `${baseUrl}/products`;
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          product_name: formData.product_name,
          category_id: parseInt(formData.category_id),
          supplier_id: parseInt(formData.supplier_id),
          unit_price: parseFloat(formData.unit_price),
          quantity_in_stock: parseInt(formData.quantity_in_stock),
          reorder_level: parseInt(formData.reorder_level),
          barcode: formData.barcode,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsDialogOpen(false);
        resetForm();
        fetchProducts();
        setStatusMessage(editingProduct ? "Product updated." : "Product added.");
        setTimeout(() => setStatusMessage(""), 3000);
      } else {
        setStatusMessage(data.message || "Operation failed.");
        setTimeout(() => setStatusMessage(""), 3000);
      }
    } catch (err) {
      setStatusMessage(`Error: ${err.message}`);
      setTimeout(() => setStatusMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete product — professional
  const handleDeleteProduct = async (productId) => {
    setIsLoading(true);
    setStatusMessage("");
    try {
      const response = await fetch(`${baseUrl}/products/${productId}`, {
        method: "DELETE",
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        fetchProducts();
        setStatusMessage("Product deleted successfully.");
      } else {
        setStatusMessage(data.message || "Failed to delete product.");
      }
    } catch (err) {
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  const handleAddProduct = () => {
    resetForm();
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      product_name: product.product_name,
      category_id: product.category_id || "",
      supplier_id: product.supplier_id || "",
      unit_price: product.unit_price,
      quantity_in_stock: product.quantity_in_stock,
      reorder_level: product.reorder_level,
      barcode: product.barcode,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      product_name: "",
      category_id: "",
      supplier_id: "",
      unit_price: "",
      quantity_in_stock: "",
      reorder_level: "",
      barcode: "",
    });
  };

  const filteredProducts = products.filter(
    (product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (stock, reorderLevel) => {
    let text = "In Stock";
    let classes = "bg-green-100 text-green-800 border-green-200";

    if (stock === 0) {
      text = "Out of Stock";
      classes = "bg-red-100 text-red-800 border-red-200";
    } else if (stock <= reorderLevel) {
      text = "Low Stock";
      classes = "bg-yellow-100 text-yellow-800 border-yellow-200";
    }

    return (
      <span
        className={`inline-flex items-center justify-center min-w-[96px] px-2 py-1 text-xs font-semibold rounded-full border ${classes}`}
      >
        {text}
      </span>
    );
  };

  return (
    <MainLayout
      title="Products"
      subtitle="Manage your inventory and product catalog"
    >
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Inline status message */}
          {statusMessage && (
            <div className="mb-4 p-4 bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-sm">
              {statusMessage}
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={fetchProducts}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                </button>
                <button
                  onClick={handleAddProduct}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </button>
              </div>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-semibold text-red-800 mb-1">
                    Error Loading Products
                  </p>
                  <p className="text-sm text-red-700">{error}</p>
                  <p className="text-xs text-red-600 mt-2">
                    • Check if your ngrok URL is correct
                    <br />
                    • Ensure the backend API is running
                    <br />• Check browser console (F12) for details
                  </p>
                  <button
                    onClick={fetchProducts}
                    className="mt-3 px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              )}

              {isLoading && (
                <div className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                    <p className="text-sm text-gray-600">Loading products...</p>
                  </div>
                </div>
              )}

              {!isLoading && !error && filteredProducts.length === 0 && (
                <div className="flex h-64 flex-col items-center justify-center text-center">
                  <Package className="mb-4 h-16 w-16 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    No products found
                  </h3>
                  <p className="mb-4 text-sm text-gray-600">
                    {searchTerm
                      ? "Try adjusting your search"
                      : "Add your first product to get started"}
                  </p>
                </div>
              )}

              {!isLoading && !error && filteredProducts.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Product
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Barcode
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Supplier
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">
                          Price
                        </th>
                        <th className="px-4 py-3 text-center font-medium text-gray-700">
                          Stock
                        </th>
                        <th className="px-4 py-3 text-center font-medium text-gray-700">
                          Reorder
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Status
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredProducts.map((product) => (
                        <tr
                          key={product.product_id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {product.product_name}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {product.barcode}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {product.category_name || "-"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {product.supplier_name || "-"}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-gray-900">
                            ₵{parseFloat(product.unit_price).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-900">
                            {product.quantity_in_stock}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-600">
                            {product.reorder_level}
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(
                              product.quantity_in_stock,
                              product.reorder_level
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteProduct(product.product_id)
                                }
                                className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add/Edit Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.product_name}
                    onChange={(e) =>
                      setFormData({ ...formData, product_name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category_id: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier
                    </label>
                    <select
                      value={formData.supplier_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          supplier_id: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select supplier</option>
                      {suppliers.map((sup) => (
                        <option key={sup.supplier_id} value={sup.supplier_id}>
                          {sup.supplier_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit Price (₵)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.unit_price}
                      onChange={(e) =>
                        setFormData({ ...formData, unit_price: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity in Stock
                    </label>
                    <input
                      type="number"
                      value={formData.quantity_in_stock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantity_in_stock: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reorder Level
                    </label>
                    <input
                      type="number"
                      value={formData.reorder_level}
                      onChange={(e) =>
                        setFormData({ ...formData, reorder_level: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Barcode
                    </label>
                    <input
                      type="text"
                      value={formData.barcode}
                      onChange={(e) =>
                        setFormData({ ...formData, barcode: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setIsDialogOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    {editingProduct ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Products;
