"use client";

export default function UserDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
      <p className="text-gray-700 mb-4">
        Welcome Sales Executive! Access your tasks, messages, and personal reports here.
      </p>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 shadow rounded">
          <h2 className="font-semibold">New Products</h2>
          <p>View and manage your assigned tasks.</p>
        </div>
        <div className="bg-white p-6 shadow rounded">
          <h2 className="font-semibold">Notifications</h2>
          <p>Stay updated with company announcements.</p>
        </div>
      </div>
    </div>
  );
}
