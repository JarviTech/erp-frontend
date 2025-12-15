"use client";

import { useState } from "react";
import PendingPOProducts from "@/components/dashboard/purchase/PendingPOProducts";
import RegisterPage from "@/components/dashboard/admin/Register";
import Sales_Overview from "@/components/dashboard/admin/Sales_Overview";

export default function AdminDashboard() {
  // Tabs state
  const tabs = [
    "User Management",
    "Purchase",
    "Finance",
    "HR",
    "IT",
    "Marketing",
    "Sales",
    "Operations",
    "Logistics",
    "Legal",
    "R&D",
  ];

  const [activeTab, setActiveTab] = useState<string>(tabs[1]);

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "User Management":
        return (
          <div className="bg-white p-6 shadow rounded">
            <h2 className="font-semibold text-xl mb-2">User Management</h2>
            <p>View and manage all registered users.</p>
          </div>
        );
      case "Purchase":
        return (
          <div className="bg-white p-6 shadow rounded">
            <h2 className="font-semibold text-xl mb-2">Open PO's</h2>
            <p>View and manage all pending purchase order products.</p>
            <PendingPOProducts />
          </div>
        );
      case "Finance":
        return (
          <div className="bg-white p-6 shadow rounded">
            <h2 className="font-semibold text-xl mb-2">Finance Department</h2>
            <p>Manage budgets, invoices, and reports.</p>
          </div>
        );
      case "HR":
        return (
          <div className="bg-white p-6 shadow rounded">
            <h2 className="font-semibold text-xl mb-2">HR Department</h2>
            <p>Employee records, recruitment, and payroll.</p>
          </div>
        );
      case "IT":
        return (
          <div className="bg-white p-6 shadow rounded">
            <h2 className="font-semibold text-xl mb-2">IT Department</h2>
            <p>Manage systems, servers, and IT tickets.</p>
          </div>
        );
      case "Marketing":
        return (
          <div className="bg-white p-6 shadow rounded">
            <h2 className="font-semibold text-xl mb-2">Marketing</h2>
            <p>Campaigns, analytics, and branding activities.</p>
          </div>
        );
      case "Sales":
        return (
          <div className="bg-white p-6 shadow rounded">
            <h2 className="font-semibold text-xl mb-2">Sales Department</h2>
            <Sales_Overview />
          </div>
        );
      case "Operations":
        return (
          <div className="bg-white p-6 shadow rounded">
            <h2 className="font-semibold text-xl mb-2">Operations</h2>
            <p>Logistics, inventory, and daily operations management.</p>
          </div>
        );
      case "Logistics":
        return (
          <div className="bg-white p-6 shadow rounded">
            <h2 className="font-semibold text-xl mb-2">Logistics</h2>
            <p>Warehouse and delivery operations.</p>
          </div>
        );
      case "Legal":
        return (
          <div className="bg-white p-6 shadow rounded">
            <h2 className="font-semibold text-xl mb-2">Legal</h2>
            <p>Contracts, compliance, and legal issues.</p>
          </div>
        );
      case "R&D":
        return (
          <div className="bg-white p-6 shadow rounded">
            <h2 className="font-semibold text-xl mb-2">R&D</h2>
            <p>Research, development, and innovation projects.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-700 mb-6">
        Welcome Admin! Select a department to manage its resources.
      </p>

      {/* Navbar Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-t-lg font-semibold transition cursor-pointer
              ${activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
            `}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">{renderTabContent()}</div>
    </div>
  );
}
