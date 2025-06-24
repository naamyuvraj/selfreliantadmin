"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Search, Eye, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/user-context";

export function ProductsTable() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [localProducts, setLocalProducts] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("inventory")
        .select("*")
        .eq("user_id", user.id);
      if (error) {
        console.error("Error fetching products:", error.message);
        return;
      }
      const dataWithStatus = data.map((product) => ({
        ...product,
        status:
          product.quantity > 10
            ? "In Stock"
            : product.quantity > 0
            ? "Low Stock"
            : "Out of Stock",
      }));
      setLocalProducts(dataWithStatus);
    };

    fetchProducts();
  }, [user]);

  const filteredProducts = localProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      product.category.toLowerCase().includes(categoryFilter);

    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-[#608C44]/20 text-[#608C44]";
      case "Low Stock":
        return "bg-[#C2925E]/20 text-[#C2925E]";
      case "Out of Stock":
        return "bg-[#C87355]/20 text-[#C87355]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleView = (product: any) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setEditFormData({ ...product });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase
      .from("inventory")
      .update({
        name: editFormData.name,
        price: editFormData.price,
        description: editFormData.description,
        quantity: editFormData.quantity,
        category: editFormData.category,
        subcategory: editFormData.subcategory,
        artisan_story: editFormData.artisan_story,
        image_urls: editFormData.image_urls,
        dimensions: editFormData.dimensions,
        weight: editFormData.weight,
        material: editFormData.material,
      })
      .eq("id", editFormData.id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Update error:", error);
      alert("Failed to update product.");
    } else {
      setLocalProducts((prev) =>
        prev.map((product) =>
          product.id === editFormData.id
            ? {
                ...editFormData,
                status:
                  editFormData.quantity > 10
                    ? "In Stock"
                    : editFormData.quantity > 0
                    ? "Low Stock"
                    : "Out of Stock",
              }
            : product
        )
      );
      setEditModalOpen(false);
      alert("Product updated successfully!");
    }

    setIsSubmitting(false);
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const { error } = await supabase
      .from("inventory")
      .delete()
      .eq("id", productId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Delete error:", error);
      alert("Failed to delete product.");
    } else {
      setLocalProducts((prev) =>
        prev.filter((product) => product.id !== productId)
      );
      alert("Product deleted successfully!");
    }
  };
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between mb-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            className="pl-8 text-sm w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="w-full sm:w-[180px] text-sm px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44]"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="traditional">Traditional Crafts</option>
          <option value="hand">Hand Made</option>
          <option value="art">Art & Design</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-10 w-10 rounded-md border bg-gray-200 mr-3 overflow-hidden">
                    {product.image_urls?.[0] ? (
                      <Image
                        src={product.image_urls[0]}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Image
                        src="/placeholder.svg"
                        alt="No Image"
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    {product.category}
                    <div className="text-xs text-gray-500">
                      {product.subcategory}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {formatPrice(product.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {product.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                      product.status
                    )}`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleView(product)}
                      className="text-gray-500 hover:text-gray-700"
                      title="View Product"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-gray-500 hover:text-gray-700"
                      title="Edit Product"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete Product"
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

      {/* View Product Modal */}
      {viewModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-medium">Product Details</h3>
              <button
                onClick={() => setViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {selectedProduct.image_urls?.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {selectedProduct.image_urls.map(
                        (url: string, index: number) => (
                          <div
                            key={index}
                            className="w-full h-40 border rounded-md overflow-hidden"
                          >
                            <Image
                              src={url}
                              alt={`Product image ${index + 1}`}
                              width={300}
                              height={160}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <Image
                      src="/placeholder.svg"
                      alt={selectedProduct.name}
                      width={300}
                      height={200}
                      className="rounded-md object-cover w-full h-full"
                    />
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {selectedProduct.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {selectedProduct.category} • {selectedProduct.subcategory}
                    </p>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(selectedProduct.price)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-sm text-gray-500">Quantity: </span>
                      <span className="font-medium">
                        {selectedProduct.quantity}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        selectedProduct.status
                      )}`}
                    >
                      {selectedProduct.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">
                    Description
                  </h5>
                  <p className="text-sm text-gray-600">
                    {selectedProduct.description}
                  </p>
                </div>

                {selectedProduct.materials && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Materials
                    </h5>
                    <p className="text-sm text-gray-600">
                      {selectedProduct.materials}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProduct.dimensions && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">
                        Dimensions
                      </h5>
                      <p className="text-sm text-gray-600">
                        {selectedProduct.dimensions}
                      </p>
                    </div>
                  )}

                  {selectedProduct.weight && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Weight</h5>
                      <p className="text-sm text-gray-600">
                        {selectedProduct.weight}
                      </p>
                    </div>
                  )}
                </div>

                {selectedProduct.artisanStory && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Artisan Story
                    </h5>
                    <p className="text-sm text-gray-600">
                      {selectedProduct.artisanStory}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-medium">Edit Product</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="edit-name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={editFormData.name || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44]"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    id="edit-price"
                    name="price"
                    value={editFormData.price || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44]"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={editFormData.description || ""}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="edit-quantity"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="edit-quantity"
                    name="quantity"
                    value={editFormData.quantity || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44]"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="edit-status"
                    name="status"
                    value={editFormData.status || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44]"
                    required
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="edit-materials"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Materials
                  </label>
                  <input
                    type="text"
                    id="edit-materials"
                    name="materials"
                    value={editFormData.materials || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-dimensions"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Dimensions
                  </label>
                  <input
                    type="text"
                    id="edit-dimensions"
                    name="dimensions"
                    value={editFormData.dimensions || ""}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#608C44] hover:bg-[#608C44]/90 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                  )}
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
