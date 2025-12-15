"use client";

import { useEffect, useState } from "react";
import ProductSearch from "@/components/dashboard/purchase/ProductSearch";
import { getAllProducts } from "@/lib/api/product";
import { getAllCustomers } from "@/lib/api/customers" ;    // <-- NEW API
import { createSalesOrder } from "@/lib/api/sales_orders";       // <-- /po/create-sales-order API
import { Product } from "@/types/purchase";

// Types
// type Product = {
//   id: number;
//   name: string;
//   composition: string;
//   pack: string;
//   newMRP: number;
//   rate: number;
//   category: string;
// };

type Customer = {
  id: number;
  name: string;
  address: string;
  gstin: string;
  contact: string;
  email: string;
  pincode: number;
};

export default function CustomerOrderPunching() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Division Selection (Biophar / Rechelist)
  const [division, setDivision] = useState<string>("");

  // Product Selection
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Order Fields
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDate, setOrderDate] = useState(new Date().toISOString().slice(0, 10));

  const [qty, setQty] = useState<number>(1);
  const [rate, setRate] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [shippingAmount, setShippingAmount] = useState<number>(0);

  const divisions = [
    { id: 1, name: "Biophar Division" },
    { id: 2, name: "Rechelist Division" },
  ];

  // Fetch initial data
  useEffect(() => {
    const load = async () => {
      const prod = await getAllProducts();
      const cust = await getAllCustomers();  // <- /po/get-all-customers
      setProducts(prod);
      setCustomers(cust);
    };
    load();
  }, []);

  // Calculations
  const baseAmount = qty * rate;
  const taxAmount = (baseAmount * taxPercent) / 100;
  const totalBeforeShipping = baseAmount - discount + taxAmount;
  const grandTotal = totalBeforeShipping + shippingAmount;

  // Submit Order
  const handleSubmit = async () => {
    if (!selectedCustomer) return alert("Select Customer");
    if (!selectedProduct) return alert("Select Product");
    if (!division) return alert("Select Division");
    // if (!orderNumber) return alert("Enter Order Number");

    const payload = {
      order_number: null,
      customer_id: selectedCustomer.id,
      order_date: orderDate,
      order_status: "PENDING",
      product_id: selectedProduct.id,
      payment_status: "UNPAID",
      payment_method: "None",
      total_amount: baseAmount,
      discount_amount: discount,
      tax_amount: taxAmount,
      shipping_amount: shippingAmount,
      grand_total: grandTotal,
      currency: "INR",
      billing_address_id: 0,
      shipping_address_id: 0,
      customer_notes: "",
      sales_rep_id: 0,
      channel: division,
      promotion_code: "",
      shipping_method: "",
      shipping_tracking_number: "",
      shipping_date: null,
      estimated_delivery_date: null,
      delivery_date: null,
      shipping_status: "PENDING",
      order_creation_date: new Date().toISOString(),
      order_confirmation_date: new Date().toISOString(),
      order_shipment_date: null,
      order_fulfillment_date: null,
      applied_discounts: "",
      loyalty_points_used: 0,
      tax_exempt: false,
      tax_percentage: taxPercent,
      compliance_code: "",
      return_status: "",
      refund_amount: 0,
      refund_date: new Date().toISOString(),
      internal_notes: "",
      customer_feedback: "",
      qty: qty,
      rate: rate,
    };

    const res = await createSalesOrder(payload);

    alert("Order Created Successfully!");
    console.log(res);

    // Reset
    setSelectedCustomer(null);
    setSelectedProduct(null);
    setOrderNumber("");
    setQty(1);
    setRate(0);
    setDiscount(0);
    setTaxPercent(0);
    setShippingAmount(0);
    setSearchTerm("");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Customer Order Punching</h1>

        {/* Order Header */}
        <div className="flex gap-6 mb-6">
          {/* <div>
            <label className="font-bold">Order Number</label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Enter Order Number"
            />
          </div> */}

          <div className="flex flex-row gap-5 justify-center items-center">
            <label className="font-bold">Order Date</label>
            <input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          {/* Division */}
          <div className="flex flex-row gap-5 justify-center items-center">
            <label className="font-bold">Division</label>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select Division</option>
              {divisions.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Customer Selector */}
        <label className="font-bold">Select Customer</label>
        <select
          className="border p-2 rounded w-full mb-4"
          value={selectedCustomer?.id || ""}
          onChange={(e) => {
            const c = customers.find((c) => c.id === Number(e.target.value));
            if (c) setSelectedCustomer(c);
          }}
        >
          <option value="">Select Customer</option>
          {customers.map((cust) => (
            <option key={cust.id} value={cust.id}>
              {cust.name}
            </option>
          ))}
        </select>

        {/* Customer info */}
        {selectedCustomer && (
          <div className="p-3 bg-gray-50 border rounded mb-6">
            <p><strong>Address:</strong> {selectedCustomer.address}</p>
            <p><strong>GSTIN:</strong> {selectedCustomer.gstin}</p>
          </div>
        )}

        {/* Product Search */}
        <label className="font-bold mb-1 block">Search Product</label>
        <div className="flex gap-2 mb-4">
          <ProductSearch
            products={products}
            setSelectedProduct={setSelectedProduct}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        {/* Selected Product Entry */}
        {selectedProduct && (
          <div className="border p-4 rounded bg-gray-50 mb-6">
            <h3 className="font-bold mb-2">{selectedProduct.name}</h3>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label>Qty</label>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(+e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label>Rate</label>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(+e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label>Discount</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(+e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label>Tax %</label>
                <input
                  type="number"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(+e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label>Shipping Amount</label>
                <input
                  type="number"
                  value={shippingAmount}
                  onChange={(e) => setShippingAmount(+e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Totals */}
        <div className="bg-white p-4 rounded shadow-md w-1/3 ml-auto">
          <p>Base Amount: ₹{baseAmount.toFixed(2)}</p>
          <p>Tax: ₹{taxAmount.toFixed(2)}</p>
          <p>Discount: ₹{discount.toFixed(2)}</p>
          <p>Shipping: ₹{shippingAmount.toFixed(2)}</p>
          <p className="text-lg font-bold mt-2">Grand Total: ₹{grandTotal.toFixed(2)}</p>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded"
        >
          Punch Order
        </button>
      </div>
    </div>
  );
}
