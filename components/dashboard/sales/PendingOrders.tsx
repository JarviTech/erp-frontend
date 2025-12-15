'use client';
import React, { useEffect, useState } from "react";
import { Product } from "@/types/purchase";
import { Customer } from "@/types/Customer"

// Define full order interface based on your JSON
interface Order {
  id: number;
  product_id: number;
  currency: string;
  shipping_tracking_number: string;
  tax_percentage: number;
  qty: number | null;
  payment_status: string;
  billing_address_id: number;
  shipping_date: string | null;
  order_confirmation_date: string | null;
  compliance_code: string;
  rate: number | null;
  order_id: string;
  payment_method: string;
  shipping_address_id: number;
  estimated_delivery_date: string | null;
  return_status: string;
  order_number: string | null;
  total_amount: number;
  customer_notes: string;
  delivery_date: string | null;
  order_shipment_date: string | null;
  refund_amount: number;
  discount_amount: number;
  sales_rep_id: number;
  shipping_status: string;
  order_fulfillment_date: string | null;
  refund_date: string | null;
  customer_id: number;
  tax_amount: number;
  channel: string;
  order_creation_date: string | null;
  applied_discounts: string;
  internal_notes: string;
  order_date: string | null;
  shipping_amount: number;
  promotion_code: string;
  loyalty_points_used: number;
  customer_feedback: string;
  order_status: string;
  grand_total: number;
  shipping_method: string;
  tax_exempt: boolean;
  product: Product;
  customer: Customer;
}

export default function PendingOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  async function fetchPendingOrders() {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/po/get-all-orders`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data: Order[] = await response.json();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load pending orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">📦 Pending Orders</h2>

      {loading && <p className="text-center text-gray-600 py-4">Loading pending orders...</p>}
      {error && <p className="text-center text-red-500 py-4">{error}</p>}
      {!loading && !error && orders.length === 0 && <p>No pending orders available.</p>}

      {!loading && !error && orders.length > 0 && (
        <div className="overflow-x-auto shadow border rounded-lg">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 border">Order Date</th>
                <th className="px-4 py-3 border">Customer</th>
                <th className="px-4 py-3 border">Product</th>
                <th className="px-4 py-3 border">Qty</th>
                <th className="px-4 py-3 border">Rate</th>
                <th className="px-4 py-3 border">Grand Total</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3 border">{order.order_date
                    ? new Date(order.order_date).toLocaleDateString("en-GB") // dd/mm/yyyy
                    : "-"}
                  </td>
                  <td className="px-4 py-3 border">{order.customer?.name}</td>
                  <td className="px-4 py-3 border">{order.product?.name}</td>
                  <td className="px-4 py-3 border">{order.qty}</td>
                  <td className="px-4 py-3 border">{order.rate}</td>
                  <td className="px-4 py-3 border">{order.grand_total}</td>
                  <td className="px-4 py-3 border">
                    <span className="px-3 py-1 bg-yellow-300 text-gray-900 text-xs font-bold rounded">
                      {order.order_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-y-auto p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Order Details</h3>

            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
              onClick={() => setSelectedOrder(null)}
            >
              ✖
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(selectedOrder).map(([key, value]) => (
                <div key={key} className="border p-2 rounded">
                  <span className="font-semibold">{key.replace(/_/g, " ")}: </span>
                  <span>{value === null ? "-" : value.toString()}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 text-right">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setSelectedOrder(null)}
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
