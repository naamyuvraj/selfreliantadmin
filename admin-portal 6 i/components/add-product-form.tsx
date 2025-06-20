"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/user-context"; // or wherever your AuthProvider is

// Helper to get subcategories
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

export default function AddProductForm() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    quantity: "",
    category: "",
    subcategory: "",
    artisan_story: "",
    dimensions: "",
    weight: "",
    material: "",
  });

  const [subcategories, setSubcategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "category") {
      setSubcategories(getSubcategories(value));
      setForm((prev) => ({ ...prev, subcategory: "" }));
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return;

    const selectedFiles = Array.from(files).slice(0, 4);
    const total = images.length + selectedFiles.length;

    if (total > 4) {
      alert("You can upload a maximum of 4 images.");
      return;
    }

    try {
      // Compress all in parallel
      const compressed = await Promise.all(
        selectedFiles.map((file) =>
          imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 800,
            useWebWorker: true,
          })
        )
      );
      setImages((prev) => [...prev, ...compressed]);
    } catch (err) {
      console.error("Image compression failed:", err);
      alert("Image compression failed.");
    }
  };

  const uploadToSupabase = async () => {
    try {
      const uploadPromises = images.map(async (img) => {
        const filename = `${uuidv4()}.${img.name.split(".").pop()}`;
        const { error } = await supabase.storage
          .from("product-images")
          .upload(filename, img);

        if (error) {
          console.error("Upload error:", error.message);
          return null;
        }

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filename);

        return urlData?.publicUrl || null;
      });

      const urls = await Promise.all(uploadPromises);
      return urls.filter((url): url is string => !!url); // filter out nulls
    } catch (err) {
      console.error("Upload failed:", err);
      return [];
    }
  };
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const image_urls = await uploadToSupabase();
      const { error } = await supabase.from("inventory").insert([
        {
          name: form.name,
          price: parseFloat(form.price),
          description: form.description,
          quantity: parseInt(form.quantity),
          category: form.category,
          subcategory: form.subcategory,
          artisan_story: form.artisan_story,
          image_urls,
          user_id: user?.id,
          dimensions: form.dimensions,
          weight: parseFloat(form.weight),
          material: form.material,
        },
      ]);

      if (error) throw error;

      alert("Product added successfully!");
      setForm({
        name: "",
        price: "",
        description: "",
        quantity: "",
        category: "",
        subcategory: "",
        artisan_story: "",
        dimensions: "",
        weight: "",
        material: "",
      });
      setImages([]);
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Add New Product
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="Handcrafted Wooden Bowl"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (₹)
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleInputChange}
            placeholder="499"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dimensions
          </label>
          <input
            type="text"
            name="dimensions"
            value={form.dimensions}
            onChange={handleInputChange}
            placeholder="e.g., 10x15x5 cm"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight (g)
          </label>
          <input
            type="number"
            name="weight"
            value={form.weight}
            onChange={handleInputChange}
            placeholder="e.g., 250"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Material
          </label>
          <input
            type="text"
            name="material"
            value={form.material}
            onChange={handleInputChange}
            placeholder="e.g., Wood, Brass, Cotton"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Describe your product in detail..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleInputChange}
            placeholder="10"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            <option value="handy-crafts">Handy Crafts</option>
            <option value="hand-made">Hand Made</option>
            <option value="art-design">Art & Design</option>
            <option value="traditional-crafts">Traditional Crafts</option>
          </select>
        </div>
        {form.category && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subcategory
            </label>
            <select
              name="subcategory"
              value={form.subcategory}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub.value} value={sub.value}>
                  {sub.label}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Images (Max 4)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files)}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
    file:rounded-full file:border-0
    file:text-sm file:font-semibold
    file:bg-blue-50 file:text-blue-700
    hover:file:bg-blue-100"
          />
          {images.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-2">
              {images.map((img, idx) => (
                <div key={idx} className="w-24 h-24 relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`preview-${idx}`}
                    className="w-full h-full object-cover rounded border"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Artisan Story (Optional)
          </label>
          <textarea
            name="artisan_story"
            value={form.artisan_story}
            onChange={handleInputChange}
            rows={3}
            placeholder="Share the story behind this product and its creator..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium flex items-center"
        >
          {loading && <Loader2 className="animate-spin h-5 w-5 mr-2" />}
          Add Product
        </button>
      </div>
    </div>
  );
}
