"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ----------------------------------------------------------
    UPDATED PO-WISE VIEW (SHOW PRODUCT DETAILS)
------------------------------------------------------------*/
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

export default function POWiseView({ list }: { list: PO[] }) {
  const router = useRouter();

  // ⭐ Sort by date: latest → oldest
  const sortedList = [...list].sort(
    (a, b) => new Date(b.po_date).getTime() - new Date(a.po_date).getTime()
  );

  return (
    <div className="space-y-6">
      {sortedList.map((po, index) => (
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
              <button
                onClick={() => router.push("edit-po")}
                className="px-3 py-1 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600 mb-2"
              >
                Edit PO
              </button>
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
