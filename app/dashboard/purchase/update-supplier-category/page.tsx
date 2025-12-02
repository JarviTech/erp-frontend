"use client";

import { useEffect, useState } from "react";

type Supplier = {
  id: number;
  name: string;
  email?: string;
  contact?: string;
  address?: string;
  gstin?: string;
  pincode?: number;
  categories: string[];
};

const ALL_CATEGORIES = ["TABLETS", "CAPSULES", "OINTMENTS", "SYRUPS", "CREAMS", "INJECTIONS"];

export default function UpdateSupplierCategories() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/po/get-suppliers`);
        if (!res.ok) throw new Error("Failed to fetch suppliers");
        const data: Supplier[] = await res.json();
        setSuppliers(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const supplier = suppliers.find(s => s.id === Number(e.target.value)) || null;
    setSelectedSupplier(supplier);
    setSelectedCategories(supplier?.categories || []);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category) // remove if already selected
        : [...prev, category]             // add if not selected
    );
  };

  const handleSave = async () => {
    if (!selectedSupplier) return;

    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/po/update-supplier-category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplier_id: selectedSupplier.id,
          categories: selectedCategories
        }),
      });

      if (!res.ok) throw new Error("Failed to update categories");
      alert("Categories updated successfully!");
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center py-10">Loading suppliers...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Update Supplier Categories</h2>

      {/* Supplier Selector */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">Select Supplier</label>
        <select
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          onChange={handleSupplierChange}
          value={selectedSupplier?.id || ""}
        >
          <option value="" disabled>Select a supplier</option>
          {suppliers.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {selectedSupplier && (
        <>
          {/* Category Checkboxes */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Edit Categories</label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_CATEGORIES.map(cat => (
                <label key={cat} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Update Categories"}
          </button>
        </>
      )}
    </div>
  );
}
