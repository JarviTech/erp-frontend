"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { addNewProduct } from "@/lib/api/product";

export default function AddNewProduct() {
  const [form, setForm] = useState({
    name: "",
    composition: "",
    mrp: "",
    rate: "",
    launchDate: "",
    hsn: "",
    pack: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
  };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("composition", form.composition);
    formData.append("mrp", form.mrp);
    formData.append("rate", form.rate);
    formData.append("launch_date", form.launchDate);
    formData.append("hsn", form.hsn);
    formData.append("pack", form.pack);
    if (image) formData.append("image", image);


    try {
      const res = await addNewProduct(formData);
      setSuccess("✅ Product added successfully!");
      setForm({ name: "", composition: "", mrp: "", rate: "", launchDate: "", hsn: "", pack: "" });
      setImage(null);
      setPreview(null);

    } catch (err) {
      console.error("Error:", err);
      setSuccess("❌ Failed to add product. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
        if (success) {
          const timer = setTimeout(() => {
            setSuccess("");
          }, 1500); // Message disappears after 1.5 seconds

          return () => clearTimeout(timer); // Clean up the timer on unmount or re-render
        }
      }, [success]);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-10">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-xl border border-gray-200">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Add New Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="border p-2 w-full rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter product name"
            />
          </div>

          {/* Composition */}
          <div>
            <label className="block text-sm font-semibold mb-1">Composition</label>
            <textarea
              name="composition"
              value={form.composition}
              onChange={handleChange}
              required
              className="border p-2 w-full rounded-md focus:ring-2 focus:ring-blue-400 outline-none h-24"
              placeholder="Enter composition"
            ></textarea>
          </div>

          {/* MRP and Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">MRP (₹)</label>
              <input
                type="number"
                name="mrp"
                value={form.mrp}
                onChange={handleChange}
                required
                className="border p-2 w-full rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter MRP"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Rate (₹)</label>
              <input
                type="number"
                name="rate"
                value={form.rate}
                onChange={handleChange}
                required
                className="border p-2 w-full rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter rate"
              />
            </div>
          </div>

          {/* HSN CODE and PACK */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">HSN CODE</label>
              <input
                type="number"
                name="hsn"
                value={form.hsn}
                onChange={handleChange}
                required
                className="border p-2 w-full rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter HSN CODE"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Pack Details</label>
              <input
                type="text"
                name="pack"
                value={form.pack}
                onChange={handleChange}
                required
                className="border p-2 w-full rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter Pack Details"
              />
            </div>
          </div>

          {/* Date of Launch */}
          <div>
            <label className="block text-sm font-semibold mb-1">Date of Launch</label>
            <input
              type="date"
              name="launchDate"
              value={form.launchDate}
              onChange={handleChange}
              required
              className="border p-2 w-full rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold mb-1">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border p-2 w-full rounded-md cursor-pointer"
            />
            {preview && (
              <div className="mt-3 flex justify-center">
                <Image
                  src={preview}
                  alt="Preview"
                  width={120}
                  height={120}
                  className="rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-semibold transition ${
              loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>

          {/* Status Message */}
          {success && (
            <p
              className={`text-center font-semibold ${
                success.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {success}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
