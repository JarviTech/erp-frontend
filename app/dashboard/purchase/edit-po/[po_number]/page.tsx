"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditPOPage() {
  const { po_number } = useParams();
  const router = useRouter();

  const [po, setPo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPO = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/po/get-po/${po_number}`
    );
    const data = await res.json();
    setPo(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPO();
  }, []);

  const updateItem = (index: number, key: string, value: any) => {
    const updated = [...po.items];
    updated[index][key] = value;
    setPo({ ...po, items: updated });
  };

  const addNewItem = () => {
    setPo({
      ...po,
      items: [
        ...po.items,
        { id: Date.now(), product_id: "", qty: 0, rate: 0, product: null },
      ],
    });
  };

  const removeItem = (index: number) => {
    const updated = [...po.items];
    updated.splice(index, 1);
    setPo({ ...po, items: updated });
  };

  const savePO = async () => {
    const payload = {
      po_date: po.po_date,
      supplier_id: po.supplier.id,
      company_id: po.company_id,
      grand_total: po.grand_total,
      items: po.items.map((item: any) => ({
        product_id: item.product_id,
        qty: Number(item.qty),
        rate: Number(item.rate),
      })),
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/po/update/${po_number}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await res.json();
    alert("PO updated successfully!");
    router.push("/dashboard/purchase/view-po");
  };

  if (loading) return <p className="p-10 text-xl">Loading...</p>;

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Edit / Revise PO – {po.po_number}
      </h1>

      {/* PO Fields */}
      <div className="space-y-4 mb-8">
        <div>
          <label className="font-medium">PO Date:</label>
          <input
            type="date"
            value={po.po_date}
            onChange={(e) => setPo({ ...po, po_date: e.target.value })}
            className="block border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="font-medium">Grand Total:</label>
          <input
            type="number"
            value={po.grand_total}
            onChange={(e) =>
              setPo({ ...po, grand_total: Number(e.target.value) })
            }
            className="block border p-2 rounded w-full"
          />
        </div>
      </div>

      {/* ITEMS TABLE */}
      <h2 className="text-xl font-semibold mb-3">Edit Items</h2>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Product ID</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Rate</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {po.items.map((item: any, index: number) => (
            <tr key={item.id} className="border-b">
              <td className="p-2">
                <input
                  type="number"
                  value={item.product_id}
                  onChange={(e) =>
                    updateItem(index, "product_id", Number(e.target.value))
                  }
                  className="border p-1 rounded w-full"
                />
              </td>

              <td className="p-2">
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) =>
                    updateItem(index, "qty", Number(e.target.value))
                  }
                  className="border p-1 rounded w-full"
                />
              </td>

              <td className="p-2">
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) =>
                    updateItem(index, "rate", Number(e.target.value))
                  }
                  className="border p-1 rounded w-full"
                />
              </td>

              <td className="p-2">
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-600 font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={addNewItem}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        + Add Item
      </button>

      {/* Save Button */}
      <div className="mt-8">
        <button
          onClick={savePO}
          className="px-6 py-3 bg-blue-700 text-white rounded-lg"
        >
          Save Revised PO
        </button>
      </div>
    </div>
  );
}
