'useClient';
import { updateProductStatus } from "@/lib/api/purchase_orders";
import { useState } from "react";
import UpdateDeliveryStatus from "./UpdateDeliveryStatus";

export default function ProductStatusUpdate({ item }: { item: any }) {
  const [status, setStatus] = useState(item.status);
  const [saving, setSaving] = useState(false);

  const updateStatus = async () => {
    setSaving(true);
    try {
        console.log(item.po_number, status, item.product_id);
        const updateStatus = await updateProductStatus(item.po_number, status, item.product_id);
        alert("Status updated successfully");
    } catch (err) {
      console.error(err);
      alert(err);
    }
    setSaving(false);
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="p-2 border">{item.po_number}</td>
      <td className="p-2 border">{item.po_date}</td>
      <td className="p-2 border">{item.supplier}</td>
      <td className="p-2 border">{item.qty}</td>
      <td className="p-2 border">{item.rate}</td>

      {/* Editable Status */}
      <td className="p-2 flex items-center gap-2">
        <select
          className={`border py-1 rounded px-2
                ${status == 'Pending' && 'bg-yellow-500'} 
                ${status == 'Received' && 'bg-green-500 text-white'} 
                ${status == 'Hold' && 'bg-orange-500 text-white'} 
                ${status == 'Cancelled' && 'bg-red-500 text-white'} 
            `}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Pending" className="bg-white text-black">Pending</option>
          <option value="Received" className="bg-white text-black">Received</option>
          <option value="Hold" className="bg-white text-black">Hold</option>
          <option value="Cancelled" className="bg-white text-black">Cancelled</option>
        </select>
        <button
          onClick={updateStatus}
          disabled={saving}
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {/* UPDATE DELIVERY STATUS BUTTON */}
        <UpdateDeliveryStatus 
          po_number={item.po_number} 
          product_id={item.product_id} 
          product_name={item.product_name}
        />
      </td>
    </tr>
  );
}
