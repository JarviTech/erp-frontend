// src/app/dashboard/config/sidebarConfig.ts

// Role 1 - Admin, 2 - Manager, 3 - Sales Executive, 4 - Senior Sales Manager, 5 - New Business Development, 6 - HR

export const sidebarConfig: Record<string, { label: string; path: string; icon?: any }[]> = {
  1: [                                                              
    { label: "Dashboard", path: "/dashboard/admin" },
    { label: "Manage Users", path: "/dashboard/admin/users" },
    { label: "Settings", path: "/dashboard/admin/settings" },
  ],
  2: [
    { label: "Dashboard", path: "/dashboard/manager" },
    { label: "Projects", path: "/dashboard/manager/projects" },
    { label: "Team", path: "/dashboard/manager/team" },
  ],
  3: [
    { label: "Dashboard", path: "/dashboard/se" },
    { label: "Products", path: "/dashboard/se/products" },
    { label: "Proforma Invoice", path: "/dashboard/se/proforma-invoice" },
    ],
  4: [
    { label: "Dashboard", path: "/dashboard/ssm" },
    { label: "Sales Reports", path: "/dashboard/ssm/reports" },
  ],
  5: [
    { label: "Dashboard", path: "/dashboard/nbd" },
    { label: "Leads", path: "/dashboard/nbd/leads" },
  ],
  6: [
    { label: "Dashboard", path: "/dashboard/hr" },
    { label: "Employee Management", path: "/dashboard/hr/employees" },
  ],
};
