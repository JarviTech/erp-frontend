"use client";
import { useState } from "react";

interface Props {
  po_number: string;
  product_id: number;
  product_name?: string;
}

export default function UpdateDeliveryStatus({ po_number, product_id, product_name }: Props) {
  const [open, setOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/po/update-product-delivery-date`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          po_number,
          product_id,
          delivery_date: deliveryDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Failed to update");

      setMessage("Delivery date updated successfully!");
      setOpen(false);
      setDeliveryDate("");

    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 bg-blue-600 text-white rounded"
      >
        Update Delivery Date
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              Update Delivery Date
            </h2>

            {/* PO and product pre-filled (disabled fields) */}
            <div className="mb-3">
              <label className="block text-sm font-medium">PO Number</label>
              <input
                type="text"
                value={po_number}
                disabled
                className="w-full border px-3 py-2 rounded bg-gray-100"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Product ID</label>
              <input
                type="text"
                value={product_id}
                disabled
                className="w-full border px-3 py-2 rounded bg-gray-100"
              />
            </div>

            {/* Delivery Date */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Delivery Date</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300"
              >
                {loading ? "Updating..." : "Submit"}
              </button>
            </div>

            {message && (
              <p className="mt-3 text-sm text-red-500">{message}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
