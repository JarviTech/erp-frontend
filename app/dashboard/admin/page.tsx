"use client";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-700 mb-4">
        Welcome Admin! You have full control over users, roles, and reports.
      </p>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 shadow rounded">
          <h2 className="font-semibold">User Management</h2>
          <p>View and manage all registered users.</p>
        </div>
        <div className="bg-white p-6 shadow rounded">
          <h2 className="font-semibold">Reports</h2>
          <p>Generate financial and operational reports.</p>
        </div>
        <div className="bg-white p-6 shadow rounded">
          <h2 className="font-semibold">Settings</h2>
          <p>Configure company-wide system settings.</p>
        </div>
      </div>
    </div>
  );
}
