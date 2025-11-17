// app/dashboard/layout.tsx
"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";
import React from "react";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";

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
      (role == 3  && pathname.startsWith("/dashboard/se")) ||
      (role == 4  && pathname.startsWith("/dashboard/ssm")) ||
      (role == 5  && pathname.startsWith("/dashboard/nbd")) ||
      (role == 6  && pathname.startsWith("/dashboard/hr")) ||
      (role == 7  && pathname.startsWith("/dashboard/purchase")) 
    ) {
      setAuthorized(true);
    } else {
      router.replace("/login"); // redirect to login
    }
  }, [pathname, router]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
