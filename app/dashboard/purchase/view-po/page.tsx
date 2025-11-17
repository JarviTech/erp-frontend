"use client";

import { useEffect, useState } from "react";

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
  const [view, setView] = useState<"po" | "product">("po");

  useEffect(() => {
    // Replace with your API later
    fetchPOs();
  }, []);

  const fetchPOs = async () => {
    // TEMP: Replace with fetch("/api/...")
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/po/get-all-po`); // or set data manually
    const data = await response.json();

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
          supplier: po.supplier.name,
          qty: item.qty,
          rate: item.rate,
          composition: item.product.composition,
          product_id: item.product_id,
        });
      });
    });

    // Sort product names alphabetically
    const sortedGroups: any = {};
    Object.keys(groups)
      .sort((a, b) => a.localeCompare(b))
      .forEach((name) => {
        sortedGroups[name] = groups[name];
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
      </div>

      {/* RENDER VIEWS */}
      {view === "po" ? <POWiseView list={poList} /> : <ProductWiseView groups={productGroups} />}
    </div>
  );
}

/* ----------------------------------------------------------
    UPDATED PO-WISE VIEW (SHOW PRODUCT DETAILS)
------------------------------------------------------------*/
function POWiseView({ list }: { list: PO[] }) {
  return (
    <div className="space-y-6">
      {list.map((po, index) => (
        <div key={index} className="border rounded p-4 shadow-sm bg-white">
          {/* PO Header Row */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-lg font-semibold">{po.po_number}</h2>
              <p className="text-sm text-gray-500">
                Supplier: <b>{po.supplier.name}</b>
              </p>
              <p className="text-sm text-gray-500">
                Date: {po.po_date}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm">Total Items: {po.items.length}</p>
              <p className="font-bold text-blue-600">₹{po.grand_total}</p>
            </div>
          </div>

          {/* PRODUCT TABLE */}
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Product Name</th>
                <th className="p-2 border">Composition</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Rate</th>
              </tr>
            </thead>

            <tbody>
              {po.items.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    {item.product ? item.product.name : "—"}
                  </td>

                  <td className="p-2 border text-sm">
                    {item.product ? item.product.composition : "—"}
                  </td>

                  <td className="p-2 border">{item.qty}</td>
                  <td className="p-2 border">{item.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}


/* ----------------------------------------------------------
    PRODUCT-WISE VIEW
------------------------------------------------------------*/
function ProductWiseView({ groups }: { groups: any }) {
  return (
    <div className="space-y-6">
      {Object.keys(groups).map((prod, idx) => (
        <div key={idx} className="border p-4 rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-3">{prod}</h2>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">PO Number</th>
                <th className="p-2 border">Supplier</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Rate</th>
              </tr>
            </thead>

            <tbody>
              {groups[prod].map((item: any, i: number) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2 border">{item.po_number}</td>
                  <td className="p-2 border">{item.supplier}</td>
                  <td className="p-2 border">{item.qty}</td>
                  <td className="p-2 border">{item.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
