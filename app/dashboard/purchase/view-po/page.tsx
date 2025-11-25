"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import POWiseView from "@/components/dashboard/purchase/POWiseView";
import ProductWiseView from "@/components/dashboard/purchase/ProductWiseView";
import ListWiseView from "@/components/dashboard/purchase/ListWiseView";

type Product = {
  id: number;
  name: string;
  composition: string;
};

type Item = {
  id: number;
  product_id: number;
  qty: number;
  rate: number;
  product: Product | null;
  status: string;
};

type PO = {
  po_number: string;
  po_date: string;
  company_id: string;
  grand_total: number;
  supplier: {
    id: number;
    name: string;
  };
  items: Item[];
};

export default function PurchaseOrdersPage() {
  const [poList, setPoList] = useState<PO[]>([]);
  const [productGroups, setProductGroups] = useState<any>({});
  const [view, setView] = useState<"po" | "product" | "list">("product");

  const router = useRouter();


  useEffect(() => {
    // Replace with your API later
    fetchPOs();
  }, []);

  const fetchPOs = async () => {
    // TEMP: Replace with fetch("/api/...")
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/po/get-all-po`); // or set data manually
    const data = await response.json();
    console.log(data)
    setPoList(data);
    groupProducts(data);
  };

  /** GROUP PRODUCTS **/
  const groupProducts = (data: PO[]) => {
  const groups: any = {};

  data.forEach((po) => {
    po.items.forEach((item) => {
      if (!item.product) return;

      const productName = item.product.name.trim();

      if (!groups[productName]) groups[productName] = [];

      groups[productName].push({
        po_number: po.po_number,
        po_date: po.po_date,
        supplier: po.supplier.name,
        qty: item.qty,
        rate: item.rate,
        composition: item.product.composition,
        product_id: item.product_id,
        status: item.status || "Pending",
      });
    });
  });

  // Sort product names alphabetically
  const sortedGroups: any = {};
  Object.keys(groups)
    .sort((a, b) => a.localeCompare(b))
    .forEach((name) => {
      // ⭐ Sort items inside each group by PO date (latest → oldest)
      sortedGroups[name] = groups[name].sort(
        (a: any, b: any) => new Date(b.po_date).getTime() - new Date(a.po_date).getTime()
      );
    });

  setProductGroups(sortedGroups);
};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Purchase Orders</h1>

      {/* Toggle */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView("po")}
          className={`px-4 py-2 rounded ${
            view === "po" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          PO Number Wise
        </button>

        <button
          onClick={() => setView("product")}
          className={`px-4 py-2 rounded ${
            view === "product" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Product Wise Listing
        </button>
        <button
          onClick={() => setView("list")}
          className={`px-4 py-2 rounded ${
            view === "list" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          PO List Wise
        </button>
      </div>

      {/* RENDER VIEWS */}
      {view === "product" && <ProductWiseView groups={productGroups}/>}
      {view === "po" && <POWiseView list={poList} /> }
      {view === "list" && <ListWiseView list={poList}/>}
    </div>
  );
}




