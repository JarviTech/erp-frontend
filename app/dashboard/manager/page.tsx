"use client";

export default function ManagerDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Manager Dashboard</h1>
      <p className="text-gray-700 mb-4">
        Welcome Manager! Oversee your team’s performance and project status.
      </p>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 shadow rounded">
          <h2 className="font-semibold">Team Overview</h2>
          <p>Track productivity and assigned tasks.</p>
        </div>
        <div className="bg-white p-6 shadow rounded">
          <h2 className="font-semibold">Project Status</h2>
          <p>Monitor active and upcoming projects.</p>
        </div>
      </div>
    </div>
  );
}
