"use client";

import { useEffect, useState } from "react";

type Supplier = {
  id: number;
  name: string;
  email: string;
  categories: string[];
};

export default function SendQuotationEmail() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([]);
  const [composition, setComposition] = useState("");
//   const [product, setProduct] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/po/get-suppliers`
        );
        if (!res.ok) throw new Error("Failed to fetch suppliers");
        const data: Supplier[] = await res.json();
        setSuppliers(data);

        const uniqueCategories = Array.from(
          new Set(data.flatMap((s) => s.categories))
        );
        setCategories(uniqueCategories);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    // Update selected suppliers whenever category changes
    if (selectedCategory) {
      const filtered = suppliers.filter((s) =>
        s.categories.includes(selectedCategory)
      );
      setSelectedSuppliers(filtered);
    } else {
      setSelectedSuppliers([]);
    }
  }, [selectedCategory, suppliers]);

  const handleSend = async () => {
    if (!selectedCategory) {
      alert("Please select a category");
      return;
    }

    if (selectedSuppliers.length === 0) {
      alert("No suppliers found for this category");
      return;
    }

    const payload = {
      composition,
      message,
      category: selectedCategory,
      suppliers: selectedSuppliers.map((s) => s.email),
    };

    try {
      setSending(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/po/send-quotation-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to send email");

      alert("Quotation emails sent successfully!");
      setComposition("");
      setMessage("");
      setSelectedCategory("");
      setSelectedSuppliers([]);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error sending emails");
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-10 font-semibold text-gray-600">
        Loading suppliers...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-500 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Send Quotation Email
      </h1>

      <div className="space-y-4">
        {/* Category Selection */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Display selected suppliers */}
        {selectedSuppliers.length > 0 && (
          <div className="border p-3 rounded-lg bg-gray-50">
            <h2 className="font-semibold text-gray-700 mb-2">
              Suppliers in "{selectedCategory}" category:
            </h2>
            <ul className="list-disc list-inside text-gray-600 max-h-40 overflow-y-auto">
              {selectedSuppliers.map((s) => (
                <li key={s.id}>{s.name} ({s.email})</li>
              ))}
            </ul>
          </div>
        )}

        {/* Composition */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Composition
          </label>
          <input
            type="text"
            value={composition}
            onChange={(e) => setComposition(e.target.value)}
            placeholder="Composition"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message to supplier"
            className="w-full border rounded-lg px-3 py-2 h-24 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          ></textarea>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={sending}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            sending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {sending ? "Sending..." : "Send Quotation Email"}
        </button>
      </div>
    </div>
  );
}
