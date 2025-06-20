"use client";

import type React from "react";
import { useState } from "react";
import { Loader2, X, ImageIcon } from "lucide-react";
import { useAuth } from "@/context/user-context";
import { supabase } from "@/lib/supabaseClient";
import imageCompression from "browser-image-compression";
export function AddProductForm() {
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<
    { id: number; file: File | null; preview: string }[]
  >([
    { id: 1, file: null, preview: "" },
    { id: 2, file: null, preview: "" },
    { id: 3, file: null, preview: "" },
    { id: 4, file: null, preview: "" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    quantity: "",
    category: "",
    subcategory: "",
    artisanStory: "",
    dimensions: "",
    weight: "",
    materials: "",
    featured: false,
    inStock: true,
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "category") {
      setSelectedCategory(value);
      setFormData((prev) => ({ ...prev, subcategory: "" }));
    }
  }

  function handleSwitchChange(name: string, checked: boolean) {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const hasImages = images.some((img) => img.file !== null);
    if (!hasImages) {
      alert("Please upload at least one product image.");
      return;
    }

    if (!user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload product images to Supabase Storage
      const uploadedImageUrls: string[] = [];

      for (const img of images) {
        if (img.file) {
          const filePath = `${user.id}/${Date.now()}-${img.file.name}`;
          const { data, error } = await supabase.storage
            .from("product-images")
            .upload(filePath, img.file, {
              cacheControl: "3600",
              upsert: true, // 👈 fixes 400
              contentType: img.file.type,
            });

          if (error) throw error;

          const { data: publicUrl } = supabase.storage
            .from("product-images")
            .getPublicUrl(filePath);

          uploadedImageUrls.push(publicUrl.publicUrl);
        }
      }

      // 2. Insert product data into `products` table
      const { error: insertError } = await supabase.from("products").insert({
        user_id: user.id, // ✅ link to artisan
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        quantity: parseInt(formData.quantity),
        category: formData.category,
        subcategory: formData.subcategory,
        artisan_story: formData.artisanStory,
        dimensions: formData.dimensions,
        weight: formData.weight,
        materials: formData.materials,
        featured: formData.featured,
        in_stock: formData.inStock,
        images: uploadedImageUrls, // assume column is `text[]`
      });

      if (insertError) {
        throw insertError;
      }

      alert(`${formData.name} has been added to your inventory.`);

      // Reset form
      setFormData({
        name: "",
        price: "",
        description: "",
        quantity: "",
        category: "",
        subcategory: "",
        artisanStory: "",
        dimensions: "",
        weight: "",
        materials: "",
        featured: false,
        inStock: true,
      });
      setImages([
        { id: 1, file: null, preview: "" },
        { id: 2, file: null, preview: "" },
        { id: 3, file: null, preview: "" },
        { id: 4, file: null, preview: "" },
      ]);
      setSelectedCategory("");
    } catch (err: any) {
      console.error("❌ Error submitting product:", err.message);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.2, // Compress to ~200KB
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });

      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) =>
          prev.map((img) =>
            img.id === id
              ? {
                  ...img,
                  file: compressedFile,
                  preview: event.target?.result as string,
                }
              : img
          )
        );
      };
      reader.readAsDataURL(compressedFile);
    }
  };
  const removeImage = (id: number) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, file: null, preview: "" } : img
      )
    );
  };

  const getSubcategories = (category: string) => {
    switch (category) {
      case "handy-crafts":
        return [
          { value: "paper-crafts", label: "Paper Crafts" },
          { value: "photo-frames", label: "Photo Frames" },
          { value: "greeting-cards", label: "Greeting Cards" },
          { value: "origami", label: "Origami" },
        ];
      case "hand-made":
        return [
          { value: "woven-baskets", label: "Woven Baskets" },
          { value: "thread-embroidery", label: "Thread Embroidery" },
          { value: "handmade-jewellery", label: "Handmade Jewellery" },
          { value: "pottery", label: "Pottery & Ceramics" },
          { value: "textiles", label: "Handloom Textiles" },
        ];
      case "art-design":
        return [
          { value: "paintings", label: "Traditional Paintings" },
          { value: "sculptures", label: "Sculptures" },
          { value: "wall-art", label: "Wall Art" },
          { value: "madhubani", label: "Madhubani Art" },
          { value: "warli", label: "Warli Art" },
        ];
      case "traditional-crafts":
        return [
          { value: "brass-items", label: "Brass Items" },
          { value: "wooden-crafts", label: "Wooden Crafts" },
          { value: "stone-carvings", label: "Stone Carvings" },
          { value: "metal-work", label: "Metal Work" },
        ];
      default:
        return [];
    }
  };

  console.log("👤 Logged-in User ID:", user?.id);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Handcrafted Wooden Bowl"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44]"
              required
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ₹
              </span>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="499"
                className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44]"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your product in detail..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44] min-h-32"
            required
          />
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44]"
              required
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44]"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="handy-crafts">Handy Crafts</option>
              <option value="hand-made">Hand Made</option>
              <option value="art-design">Art & Design</option>
              <option value="traditional-crafts">Traditional Crafts</option>
            </select>
          </div>
        </div>

        {selectedCategory && (
          <div>
            <label
              htmlFor="subcategory"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subcategory
            </label>
            <select
              id="subcategory"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44]"
            >
              <option value="" disabled>
                Select a subcategory
              </option>
              {getSubcategories(selectedCategory).map((subcategory) => (
                <option key={subcategory.value} value={subcategory.value}>
                  {subcategory.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Product Images</h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative border rounded-md p-2 h-40"
              >
                {image.preview ? (
                  <>
                    <img
                      src={image.preview || "/placeholder.svg"}
                      alt={`Product image ${image.id}`}
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer border-2 border-dashed rounded-md border-gray-300 hover:border-[#C87355]">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">Upload image</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, image.id)}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="artisanStory"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Artisan Story (Optional)
          </label>
          <textarea
            id="artisanStory"
            name="artisanStory"
            value={formData.artisanStory}
            onChange={handleChange}
            placeholder="Share the story behind this product and its creator..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44] min-h-32"
          />
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#608C44] hover:bg-[#608C44]/90 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
            )}
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}
