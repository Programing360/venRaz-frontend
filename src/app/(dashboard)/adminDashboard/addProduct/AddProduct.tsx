"use client";
import React, { useState, useEffect } from "react";

import axios from "axios";
import { generateAIDescription } from "@/services/ai.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ICategory {
  _id: string;
  name: string;
}

export const AddProductForm = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("0");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [flashSalePrice, setFlashSalePrice] = useState("");
  const [flashSaleEndDate, setFlashSaleEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/categories`)
      .then((res) => res.data?.data ?? res.data ?? [])
      .then((data: ICategory[]) => setCategories(data))
      .catch(() => console.error("Failed to load categories"));
  }, []);

  // AI Description & Auto Category
  const handleAIGenerate = async () => {
    if (!name.trim()) return alert("প্রোডাক্টের নাম লিখুন!");
    setAiLoading(true);
    try {
      const res = await generateAIDescription({
        title: name,
        category,
        language: "bn",
      });
      if (res.data) {
        setDescription(res.data.description);
        if (res.data.suggestedCategory && !category)
          setCategory(res.data.suggestedCategory);
      }

      // console.log(res.data);
    } catch {
      alert("AI জেনারেট করতে ব্যর্থ হয়েছে!");
    } finally {
      setAiLoading(false);
    }
  };

  // Submit Product with Image Upload
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!images || images.length === 0)
      return alert("কমপক্ষে একটি ছবি সিলেক্ট করুন!");

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("isFeatured", String(isFeatured));
    formData.append("isFlashSale", String(isFlashSale));
    if (isFlashSale) {
      formData.append("flashSalePrice", flashSalePrice);
      formData.append("flashSaleEndDate", flashSaleEndDate);
    }

    // Append Image Files
    Array.from(images).forEach((file) => {
      formData.append("images", file);
    });

    // FormData দেখার জন্য সঠিক কাস্টম লগ
    // console.log("---- FormData Values ----");
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/v1/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res);

      alert("প্রোডাক্ট এবং ব্যাকগ্রাউন্ড রিমুভড ছবি সফলভাবে যোগ হয়েছে!");
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "প্রোডাক্ট অ্যাড করতে সমস্যা হয়েছে!";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmitProduct}
      className="max-w-3xl mx-auto p-6 bg-white text-gray-800 shadow-md rounded-lg space-y-4"
    >
      <h2 className="text-2xl font-bold border-b pb-2">Add New Product</h2>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Product Name *</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Wireless Headphones"
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Image File Input */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Product Images (Auto Background Removal On) *
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(e.target.files)}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Category & Brand */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Brand</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Sony"
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      {/* Price, Discount & Stock */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price ($) *</label>
          <input
            type="number"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="150"
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount (%)</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="10"
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stock *</label>
          <input
            type="number"
            required
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="50"
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      {/* AI Button */}
      <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded">
        <span className="text-sm">Generate Description using AI</span>
        <button
          type="button"
          onClick={handleAIGenerate}
          disabled={aiLoading}
          className="bg-indigo-600 text-white px-3 py-1.5 rounded text-sm font-medium"
        >
          {aiLoading ? "Generating..." : "✨ AI Generate"}
        </button>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Checkboxes */}
      <div className="flex space-x-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          <span className="text-sm font-medium">Featured Product</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isFlashSale}
            onChange={(e) => setIsFlashSale(e.target.checked)}
          />
          <span className="text-sm font-medium">Flash Sale</span>
        </label>
      </div>

      {/* Flash Sale Details */}
      {isFlashSale && (
        <div className="grid grid-cols-2 gap-4 p-3 bg-yellow-50 border rounded">
          <div>
            <label className="block text-sm font-medium mb-1">
              Flash Sale Price ($)
            </label>
            <input
              type="number"
              value={flashSalePrice}
              onChange={(e) => setFlashSalePrice(e.target.value)}
              placeholder="120"
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Flash Sale End Date
            </label>
            <input
              type="datetime-local"
              value={flashSaleEndDate}
              onChange={(e) => setFlashSaleEndDate(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded"
      >
        {loading ? "Processing & Uploading..." : "📦 Add Product"}
      </button>
    </form>
  );
};
