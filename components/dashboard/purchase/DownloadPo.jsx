import React from 'react'

export default function DownloadPo({poId, poNumber}) {

    const downloadPO = async (poId) => {
    if (!poId) {
      alert("PO number not available");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/po/purchase-orders/${poId}/pdf`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `po_${poNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error downloading PDF");
    }
  };

  return (
    <div>
        <button onClick={() => downloadPO(poId)} className="bg-red-500 text-white px-6 py-2 rounded">
              Download PO
        </button>
    </div>
  )
}