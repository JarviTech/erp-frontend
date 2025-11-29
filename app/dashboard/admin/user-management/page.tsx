"use client";

import { useState } from "react";
import PendingPOProducts from "@/components/dashboard/purchase/PendingPOProducts";
import RegisterPage from "@/components/dashboard/admin/Register";

export default function UserManagementPage() {
  // Tabs state
  const tabs = [
    "Register User",
    "View All Users",
    "Edit User Data",
    "Delete User",
    "Assign Roles",
  ];

  const [activeTab, setActiveTab] = useState<string>(tabs[0]);

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "Register User":
        return (
          <div className="bg-white p-6 shadow rounded">
            <h2 className="font-semibold text-xl mb-2">Register A User</h2>
            <RegisterPage />
          </div>
        );
      case "View All Users":
        return (
          <div className="bg-white p-6 shadow rounded">
            <h2 className="font-semibold text-xl mb-2">View All Users</h2>
            <p>View and manage all registered users.</p>
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
