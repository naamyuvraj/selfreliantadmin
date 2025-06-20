"use client"

import type React from "react"

import { useState } from "react"
import { Pencil, Trash2, Search, Eye, X, Loader2 } from "lucide-react"
import Image from "next/image"

const products = [
  {
    id: "PROD-1",
    name: "Handcrafted Wooden Bowl",
    category: "Traditional Crafts",
    subcategory: "Wooden Crafts",
    price: 499,
    quantity: 15,
    status: "In Stock",
    description:
      "Beautiful handcrafted wooden bowl made from sustainable teak wood. Perfect for serving fruits or as decorative piece.",
    materials: "Teak Wood",
    dimensions: "25 x 25 x 8 cm",
    weight: "500g",
    artisanStory: "Crafted by master artisan Ravi Kumar from Kerala, who has been working with wood for over 20 years.",
  },
  {
    id: "PROD-2",
    name: "Embroidered Phulkari Dupatta",
    category: "Hand Made",
    subcategory: "Handloom Textiles",
    price: 2999,
    quantity: 8,
    status: "Low Stock",
    description:
      "Traditional Phulkari dupatta with intricate embroidery work from Punjab. Made with pure cotton fabric.",
    materials: "Cotton, Silk Thread",
    dimensions: "250 x 100 cm",
    weight: "200g",
    artisanStory: "Hand-embroidered by women artisans from Punjab, preserving the traditional Phulkari art form.",
  },
  {
    id: "PROD-3",
    name: "Blue Pottery Vase",
    category: "Hand Made",
    subcategory: "Pottery & Ceramics",
    price: 1799,
    quantity: 20,
    status: "In Stock",
    description:
      "Elegant blue pottery vase with traditional Jaipur blue pottery technique. Perfect for home decoration.",
    materials: "Clay, Natural Dyes",
    dimensions: "20 x 20 x 30 cm",
    weight: "800g",
    artisanStory: "Created by skilled potters from Jaipur using the ancient blue pottery technique.",
  },
  {
    id: "PROD-4",
    name: "Madhubani Wall Hanging",
    category: "Art & Design",
    subcategory: "Madhubani Art",
    price: 3299,
    quantity: 5,
    status: "Low Stock",
    description: "Traditional Madhubani painting on canvas depicting nature and mythology themes.",
    materials: "Canvas, Natural Colors",
    dimensions: "40 x 30 cm",
    weight: "300g",
    artisanStory: "Painted by women artists from Mithila region, Bihar, keeping the ancient art form alive.",
  },
  {
    id: "PROD-5",
    name: "Kundan Necklace Set",
    category: "Hand Made",
    subcategory: "Handmade Jewellery",
    price: 4999,
    quantity: 12,
    status: "In Stock",
    description: "Exquisite Kundan necklace set with matching earrings. Perfect for special occasions and festivals.",
    materials: "Brass, Kundan Stones, Pearls",
    dimensions: "Necklace: 45 cm, Earrings: 6 cm",
    weight: "150g",
    artisanStory: "Handcrafted by skilled jewelers from Rajasthan using traditional Kundan setting techniques.",
  },
]

export function ProductsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [localProducts, setLocalProducts] = useState(products)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [editFormData, setEditFormData] = useState<any>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredProducts = localProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || product.category.toLowerCase().includes(categoryFilter)

    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-[#608C44]/20 text-[#608C44]"
      case "Low Stock":
        return "bg-[#C2925E]/20 text-[#C2925E]"
      case "Out of Stock":
        return "bg-[#C87355]/20 text-[#C87355]"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleView = (product: any) => {
    setSelectedProduct(product)
    setViewModalOpen(true)
  }

  const handleEdit = (product: any) => {
    setSelectedProduct(product)
    setEditFormData({ ...product })
    setEditModalOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      // Update the product in the local state
      setLocalProducts((prev) => prev.map((product) => (product.id === editFormData.id ? editFormData : product)))
      setIsSubmitting(false)
      setEditModalOpen(false)
      alert("Product updated successfully!")
    }, 1000)
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleDelete = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setLocalProducts((prev) => prev.filter((product) => product.id !== productId))
      alert("Product deleted successfully!")
    }
  }

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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-md border bg-gray-200 mr-3">
                      <Image
                        src="/placeholder.svg"
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="font-medium">{product.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    {product.category}
                    <div className="text-xs text-gray-500">{product.subcategory}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">{formatPrice(product.price)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">{product.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(product.status)}`}>
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
              <button onClick={() => setViewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="h-48 w-full rounded-md border bg-gray-200 mb-4">
                    <Image
                      src="/placeholder.svg"
                      alt={selectedProduct.name}
                      width={300}
                      height={200}
                      className="rounded-md object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedProduct.name}</h4>
                    <p className="text-sm text-gray-500">
                      {selectedProduct.category} • {selectedProduct.subcategory}
                    </p>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-gray-900">{formatPrice(selectedProduct.price)}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-sm text-gray-500">Quantity: </span>
                      <span className="font-medium">{selectedProduct.quantity}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedProduct.status)}`}>
                      {selectedProduct.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                  <p className="text-sm text-gray-600">{selectedProduct.description}</p>
                </div>

                {selectedProduct.materials && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Materials</h5>
                    <p className="text-sm text-gray-600">{selectedProduct.materials}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProduct.dimensions && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Dimensions</h5>
                      <p className="text-sm text-gray-600">{selectedProduct.dimensions}</p>
                    </div>
                  )}

                  {selectedProduct.weight && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Weight</h5>
                      <p className="text-sm text-gray-600">{selectedProduct.weight}</p>
                    </div>
                  )}
                </div>

                {selectedProduct.artisanStory && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Artisan Story</h5>
                    <p className="text-sm text-gray-600">{selectedProduct.artisanStory}</p>
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
              <button onClick={() => setEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-1">
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
                <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label htmlFor="edit-quantity" className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label htmlFor="edit-materials" className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label htmlFor="edit-dimensions" className="block text-sm font-medium text-gray-700 mb-1">
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
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />}
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
