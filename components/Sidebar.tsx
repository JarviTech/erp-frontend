// src/app/dashboard/components/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { sidebarConfig } from "./dashboard/config/sidebarConfig";
import { useUserRole } from "../hooks/useUserRole";
import { Fragment } from "react";
import { removeToken } from "@/lib/auth";

export default function Sidebar() {
  const {role, username} = useUserRole();
  const pathname = usePathname();
   const router = useRouter();

  const items = sidebarConfig[role] ?? [];

  return (
    <aside className="w-64 bg-blue-100 border-r min-h-screen p-4">
      <div className="mb-6">
        <h3 className="font-semibold text-lg">BIOPHAR</h3>
        <p className="text-sm text-slate-500 capitalize">welcome {username}!</p>
      </div>

      <nav>
        <ul className="space-y-1">
          {items.map((it) => (
            <li key={it.path}>
              <Link
                href={it.path}
                className={
                  "block px-3 py-2 rounded " +
                  (pathname === it.path ? "bg-sky-600 text-white" : "text-slate-700 hover:bg-slate-100")
                }
              >
                <div className="flex items-center gap-3">
                  {it.icon ? <span>{it.icon}</span> : null}
                  <span>{it.label}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <button
        onClick={() => {
        removeToken();
        router.push("/login");
        }}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4 cursor-pointer"
    >
        Logout
    </button>
    </aside>
  );
}
