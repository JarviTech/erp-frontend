"use client";

export default function TotalsSection({
  totalBeforeTax,
  totalTax,
  grandTotal,
  onPdf,
  onReset,
}: {
  totalBeforeTax: string;
  totalTax: string;
  grandTotal: string;
  onPdf: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex justify-end mt-6 flex-col items-end space-y-2">
      <p>Total Before Tax: ₹{totalBeforeTax}</p>
      <p>Total Tax: ₹{totalTax}</p>
      <p className="text-lg font-bold">Grand Total: ₹{grandTotal}</p>

      <div className="flex gap-3 mt-3">
        <button onClick={onPdf} className="bg-green-600 text-white px-6 py-2 rounded">
          Download PO
        </button>

        <button onClick={onReset} className="bg-red-500 text-white px-6 py-2 rounded">
          New PO
        </button>
      </div>
    </div>
  );
}
