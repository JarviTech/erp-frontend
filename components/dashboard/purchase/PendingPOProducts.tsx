"use client";

import { useEffect, useState } from "react";

// Type definitions
interface Product {
  id: number;
  name: string;
  composition: string;
}

interface PendingProduct {
  po_number: string;
  product_id: number;
  qty: number;
  rate: number;
  status: string;
  days_pending: number | null;
  product: Product | null;
  po_date: string | null;
}

interface PendingPOResponse {
  total_pending: number;
  pending_products: PendingProduct[];
}

export default function PendingPOProducts() {
  const [data, setData] = useState<PendingPOResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/po/get-pending-po-products`);
        if (!res.ok) throw new Error("Failed to fetch pending PO products");

        const result: PendingPOResponse = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <p className="text-center text-gray-500 py-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <div className="p-6">
      {/* Summary Card */}
      <div className="p-6 bg-white shadow rounded text-center">
        <h2 className="text-xl font-semibold text-gray-800">Pending Products</h2>
        <p className="text-3xl font-bold text-blue-600 my-4">{data?.total_pending}</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => setShowModal(true)}
        >
          View Details
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-11/12 md:w-4/5 lg:w-3/4 max-h-[90vh] overflow-y-auto rounded shadow-lg p-6 relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-4">Pending PO Products Details</h2>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow rounded-lg">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm text-gray-700 uppercase tracking-wider">
                    <th className="px-4 py-3">PO Number</th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Rate</th>
                    <th className="px-4 py-3">Days Pending</th>
                    <th className="px-4 py-3">PO Date</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {data?.pending_products.map((item, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50 transition">
                      <td className="px-4 py-3">{item.po_number}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold">{item.product?.name || "N/A"}</p>
                          <p className="text-sm text-gray-500">{item.product?.composition}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">{item.qty}</td>
                      <td className="px-4 py-3">₹ {item.rate}</td>
                      <td className="px-4 py-3 font-semibold text-red-600">
                        {item.days_pending ?? "—"} days
                      </td>
                      <td className="px-4 py-3">{item.po_date ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-right">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
