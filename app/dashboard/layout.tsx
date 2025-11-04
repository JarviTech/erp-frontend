// app/dashboard/layout.tsx
import React from "react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-blue-700">BIOPHAR</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard/admin" className="block p-2 rounded hover:bg-blue-700">
            Admin Dashboard
          </Link>
          <Link href="/dashboard/manager" className="block p-2 rounded hover:bg-blue-700">
            Manager Dashboard
          </Link>
          <Link href="/dashboard/user" className="block p-2 rounded hover:bg-blue-700">
            User Dashboard
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
