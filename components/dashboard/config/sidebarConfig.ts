// src/app/dashboard/config/sidebarConfig.ts

// Role 1 - Admin, 2 - Manager, 3 - Sales Executive, 4 - Senior Sales Manager, 5 - New Business Development, 6 - HR

export const sidebarConfig: Record<string, { label: string; path: string; icon?: any }[]> = {
  1: [                                                              
    { label: "Dashboard", path: "/dashboard/admin" },
    { label: "Manage Users", path: "/dashboard/admin/user-management" },
    // { label: "Settings", path: "/dashboard/admin/settings" },
    { label: "Purchase Orders", path: "/dashboard/admin/view-po" },
    { label: "Products", path: "/dashboard/admin/products" },
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
    { label: "Create Customer", path: "/dashboard/se/create-customer" },
    { label: "Punch Order", path: "/dashboard/se/punch-order" },
    { label: "Orders", path: "/dashboard/se/pending-orders" },
    ],
  4: [
    { label: "Dashboard", path: "/dashboard/ssm" },
    { label: "Sales Reports", path: "/dashboard/ssm/reports" },
  ],
  5: [
    { label: "Dashboard", path: "/dashboard/nbd" },
    { label: "Add New Product", path: "/dashboard/nbd/add-new-product" },
    { label: "Products", path: "/dashboard/nbd/products" },
  ],
  6: [
    { label: "Dashboard", path: "/dashboard/hr" },
    { label: "Employee Management", path: "/dashboard/hr/employees" },
  ],
  7: [
    { label: "Dashboard", path: "/dashboard/purchase" },
    { label: "Create PO", path: "/dashboard/purchase/create-po" },
    { label: "View All PO's", path: "/dashboard/purchase/view-po" },
    { label: "Create Supplier", path: "/dashboard/purchase/create-supplier" },
    { label: "View All Suppliers", path: "/dashboard/purchase/view-suppliers" },
    { label: "Query Quotation", path: "/dashboard/purchase/query-quotation" },
    { label: "Update Supplier Category", path: "/dashboard/purchase/update-supplier-category" },
  ],
};
