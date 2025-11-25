import { useState, useEffect } from "react";
import EditPoModal from "./EditPoModal";

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


export default function ListWiseView({ list }: { list: PO[] }) {

  const [po, setPo] = useState<PO |null>(null);

  const editPO = (purchase_order: PO) => {
    setPo(purchase_order); // open modal
  };

  return (
    <>
      <div className="space-y-6">
        {list.map((po, index) => (
          <div key={index} className="border rounded p-4 shadow-sm bg-white">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="text-lg font-semibold">{po.po_number}</h2>
                <p className="text-sm text-gray-500">
                  Supplier: <b>{po.supplier.name}</b>
                </p>
                <p className="text-sm text-gray-500">Date: {po.po_date}</p>
              </div>

              <div className="text-right">
                <button
                  onClick={() => editPO(po)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600 mb-2"
                >
                  Edit PO
                </button>

                <p className="text-sm">Total Items: {po.items.length}</p>
                <p className="font-bold text-blue-600">
                  ₹{po.grand_total}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {po && (
        <EditPoModal
          po={po}
          onClose={() => setPo(null)}
        />
      )}
    </>
  );
}
