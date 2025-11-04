// app/dashboard/layout.tsx
"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";
import React from "react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload || !payload.role) {
      removeToken();
      router.replace("/login");
      return;
    }
    
    const role = payload.role;
    // Check access permission based on role
    if (
      (role == 1 && pathname.startsWith("/dashboard/admin")) ||
      (role == 2 && pathname.startsWith("/dashboard/manager")) ||
      (role == 3  && pathname.startsWith("/dashboard/user"))
    ) {
      setAuthorized(true);
    } else {
      router.replace("/login"); // redirect to login
    }
  }, [pathname, router]);

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
          <button
            onClick={() => {
              removeToken();
              router.push("/login");
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4 cursor-pointer"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
