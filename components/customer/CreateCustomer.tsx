"use client";

import { useEffect, useState } from "react";

export default function CreateCustomerForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [salesReps, setSalesReps] = useState<any[]>([]);
  const [salesRepLoading, setSalesRepLoading] = useState(true);

  // ------------------ Fetch Sales Rep List ------------------
  useEffect(() => {
    const fetchSalesReps = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/po/get-sales-rep`);
        const data = await res.json();
        console.log(data);
        setSalesReps(data || []);
      } catch (error) {
        console.error("Failed to load sales reps");
      } finally {
        setSalesRepLoading(false);
      }
    };

    fetchSalesReps();
  }, []);

  // ------------------ Form Submit Handler ------------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.target);
    const body: any = {};
    formData.forEach((value, key) => (body[key] = value));

    body.sales_rep = Number(body.sales_rep);
    body.credit_limit = Number(body.credit_limit);
    body.pincode = Number(body.pincode);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/po/create-customer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error("Failed to create customer");

      setMessage("Customer created successfully!");
      e.target.reset();
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold mb-4 text-center">Create New Customer</h2>

      {message && (
        <div className="p-3 rounded bg-blue-100 text-blue-700 text-center">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* -------------------- Section: Basic Info -------------------- */}
        <div className="bg-white p-6 shadow rounded-lg space-y-4 border-t-4 border-blue-600">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Basic Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" name="name" placeholder="Company Name" required autoFocus />
            <input className="input" name="email" placeholder="Email" type="email" required />
            <input className="input" name="website" placeholder="Website" />
            <select className="input" name="customer_status">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* -------------------- Section: Contact Info -------------------- */}
        <div className="bg-white p-6 shadow rounded-lg space-y-4 border-t-4 border-green-600">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Contact Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" name="contact_person" placeholder="Contact Person" required />
            <input className="input" name="contact_number" placeholder="Contact Number" required />
            <input
              className="input"
              name="alternate_contact_number"
              placeholder="Alternate Contact Number"
            />
            <input className="input" name="address" placeholder="Primary Address" required />
            <input className="input" name="pincode" placeholder="Pincode" type="number" />
          </div>
        </div>

        {/* -------------------- Section: Address Details -------------------- */}
        <div className="bg-white p-6 shadow rounded-lg space-y-4 border-t-4 border-purple-600">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Address Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" name="shipping_address" placeholder="Shipping Address" />
            <input className="input" name="billing_address" placeholder="Billing Address" />
          </div>
        </div>

        {/* -------------------- Section: Financial / Credit -------------------- */}
        <div className="bg-white p-6 shadow rounded-lg space-y-4 border-t-4 border-yellow-600">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Financial Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* ---- Updated Payment Terms Dropdown ---- */}
                <select className="input" name="payment_terms" required>
                <option value="">Select Payment Terms</option>
                <option value="CASH">CASH</option>
                <option value="ADVANCE">ADVANCE</option>
                <option value="COD">COD</option>
                <option value="CREDIT">CREDIT</option>
                <option value="PDC">PDC</option>
                </select>

                <input className="input" name="credit_limit" placeholder="Credit Limit" type="number" />
                <input className="input uppercase" name="gstin" placeholder="GSTIN" />
                <input
                className="input"
                name="account_creation_date"
                type="date"
                defaultValue="2025-12-03"
                />
            </div>
        </div>

        {/* -------------------- Section: Sales Rep -------------------- */}
        <div className="bg-white p-6 shadow rounded-lg space-y-4 border-t-4 border-red-600">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Sales Representative</h3>

          {salesRepLoading ? (
            <p className="text-gray-500">Loading sales reps...</p>
          ) : (
            <select className="input" name="sales_rep" required>
              <option value="">Select Sales Rep</option>
              {salesReps.map((rep: any) => (
                <option key={rep.id} value={rep.id}>
                  {rep.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* -------------------- Notes Section -------------------- */}
        <div className="bg-white p-6 shadow rounded-lg space-y-4 border-t-4 border-gray-600">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Additional Notes</h3>
          <textarea
            className="input h-28"
            name="notes"
            placeholder="Write any notes here..."
          ></textarea>
        </div>

        {/* -------------------- Submit -------------------- */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold shadow"
        >
          {loading ? "Creating..." : "Create Customer"}
        </button>
      </form>
    </div>
  );
}
