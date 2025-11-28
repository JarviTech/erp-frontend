import { useState, useEffect } from "react";

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
  po_id: number;
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

export default function EditPoModal({
  po,
  onClose,
}: {
  po: PO | null;
  onClose: () => void;
}) {
  const [poNumber, setPoNumber] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    if (po) {
      setPoNumber(po.po_number);
      setItems(po.items);

      const total = po.items.reduce(
        (sum, item) => sum + item.qty * item.rate,
        0
      );
      setGrandTotal(total);
    }
  }, [po]);

  if (!po) return null;

  const recalcGrandTotal = (updatedItems: Item[]) => {
    const subtotal = updatedItems.reduce(
      (sum, item) => sum + item.qty * item.rate,
      0
    );

    const gst = subtotal * 0.05; // 5% GST
    setGrandTotal(subtotal + gst);
  };

  const handleItemChange = (
    index: number,
    field: "qty" | "rate",
    value: number
  ) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
    recalcGrandTotal(updatedItems);
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    recalcGrandTotal(updatedItems);
  };

  const handleSave = async () => {
    const payload = {
      po_id: po.po_id,
      po_number: poNumber,
      grand_total: grandTotal,
      items: items.map((item) => ({
        product_id: item.product_id,
        qty: item.qty,
        rate: item.rate,
      })),
    };

    // console.log("Sending Payload:", payload);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/po/edit-po`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update PO");

      console.log("PO updated successfully");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to save PO");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit PO: {po.po_number}</h2>
          <button onClick={onClose} className="text-red-500 font-bold">
            X
          </button>
        </div>

        <div className="space-y-3">
          {/* PO Number */}
          <div>
            <label className="font-semibold">PO Number: </label>
            <input
              className="border p-1 w-full"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
            />
          </div>

          {/* Supplier */}
          <div>
            <label className="font-semibold">Supplier: </label>
            <input
              className="border p-1 w-full bg-gray-200"
              defaultValue={po.supplier.name}
              disabled
            />
          </div>

          {/* PO Date */}
          <div>
            <label className="font-semibold">PO Date: </label>
            <input
              className="border p-1 w-full bg-gray-200"
              defaultValue={po.po_date}
              disabled
            />
          </div>

          {/* Line Items */}
          {items.map((item, i) => (
            <div key={item.id} className="p-2 border-b relative">
              <p className="font-semibold mb-2">
                Product Name: {item.product?.name}
              </p>

              <div className="grid grid-cols-2 gap-4 items-center">
                {/* Qty */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600">Quantity</label>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      handleItemChange(i, "qty", Number(e.target.value))
                    }
                    className="border rounded px-2 py-1"
                  />
                </div>

                {/* Rate */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600">Rate</label>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      handleItemChange(i, "rate", Number(e.target.value))
                    }
                    className="border rounded px-2 py-1"
                  />
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteItem(i)}
                className="absolute top-2 right-2 text-red-500 font-bold"
              >
                Delete
              </button>
            </div>
          ))}

          {/* Grand Total */}
          <div className="font-semibold text-right text-lg">
            Grand Total: ₹{grandTotal}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded w-full cursor-pointer hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
