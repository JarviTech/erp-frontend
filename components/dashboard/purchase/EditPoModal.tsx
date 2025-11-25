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
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (po) {
      setItems(po.items);
    }
  }, [po]);

  if (!po) return null;

  const handleItemChange = (index: number, field: "qty" | "rate", value: number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleSave = () => {
    // Here you can call your API to save updated PO
    console.log("Updated items:", items);
    onClose(); // close modal after saving
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
          <div>
            <label className="font-semibold">Supplier: </label>
            <input
              className="border p-1 w-full bg-gray-200"
              defaultValue={po.supplier.name}
              disabled
            />
          </div>

          <div>
            <label className="font-semibold">PO Date: </label>
            <input
              className="border p-1 w-full bg-gray-200"
              defaultValue={po.po_date}
              disabled
            />
          </div>

          {items.map((item, i) => (
            <div key={item.id} className="p-2 border-b relative">
              <p className="font-semibold mb-2">
                Product Name: {item.product?.name}
              </p>
              <div className="grid grid-cols-2 gap-4 items-center">
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

              <button
                onClick={() => handleDeleteItem(i)}
                className="absolute top-2 right-2 text-red-500 font-bold"
              >
                Delete
              </button>
            </div>
          ))}

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
    