"use client";
import { useState } from "react";
import { createSupplier } from "@/lib/api/suppliers";

export default function CreateSupplier() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    contact: "",
    gstin: "",
    pincode: "",
    categories: []
  });

  const categoryOptions = [
    "TABLETS",
    "CAPSULES",
    "OINTMENTS",
    "SYRUPS",
    "INJECTIONS",
    "POWDERS"
  ];

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "categories") {
      if (checked) {
        setFormData({
          ...formData,
          categories: [...formData.categories, value]
        });
      } else {
        setFormData({
          ...formData,
          categories: formData.categories.filter((c) => c !== value)
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      pincode: Number(formData.pincode)
    };

    try {
      const res = await createSupplier(payload);
      alert("Supplier created successfully with ID: " + res.id);
      setFormData({
        name: "",
        address: "",
        email: "",
        contact: "",
        gstin: "",
        pincode: "",
        categories: []
      });
    } catch (error) {
      console.log("Error creating supplier:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
      <div className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-2xl border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Create Supplier
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Supplier Name */}
          <div>
            <label className="block font-semibold text-gray-700">Supplier Name</label>
            <input
              type="text"
              name="name"
              className="mt-2 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter supplier name"
              onChange={handleChange}
              value={formData.name}
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block font-semibold text-gray-700">Address</label>
            <textarea
              name="address"
              className="mt-2 w-full border rounded-lg px-4 py-2 h-24 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter address"
              onChange={handleChange}
              value={formData.address}
              required
            ></textarea>
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="mt-2 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="example@domain.com"
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block font-semibold text-gray-700">Contact Number</label>
            <input
              type="text"
              name="contact"
              className="mt-2 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="+91 9876543210"
              onChange={handleChange}
              value={formData.contact}
            />
          </div>

          {/* GSTIN */}
          <div>
            <label className="block font-semibold text-gray-700">GSTIN</label>
            <input
              type="text"
              name="gstin"
              className="mt-2 w-full border rounded-lg px-4 py-2 uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="22AAAAA0000A1Z5"
              onChange={handleChange}
              value={formData.gstin}
            />
          </div>

          {/* Pincode */}
          <div>
            <label className="block font-semibold text-gray-700">Pincode</label>
            <input
              type="number"
              name="pincode"
              className="mt-2 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="560001"
              onChange={handleChange}
              value={formData.pincode}
            />
          </div>

          {/* Categories Multi-Select */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Categories</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categoryOptions.map((cat) => (
                <label
                  key={cat}
                  className={`flex items-center space-x-2 p-2 border rounded-lg cursor-pointer hover:bg-blue-50 ${
                    formData.categories.includes(cat) ? "bg-blue-100 border-blue-400" : "bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="categories"
                    value={cat}
                    checked={formData.categories.includes(cat)}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-700 font-medium">{cat}</span>
                </label>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Select one or more categories
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition"
          >
            Create Supplier
          </button>
        </form>
      </div>
    </div>
  );
}
