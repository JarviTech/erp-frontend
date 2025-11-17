"use client";

import { useEffect, useState, ChangeEvent } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getAllProducts } from "@/lib/api/product";

import CompanySelector from "@/components/dashboard/purchase/CompanySelector";
import SupplierSelector from "@/components/dashboard/purchase/SupplierSelector";
import ProductSearch from "@/components/dashboard/purchase/ProductSearch";
import { Supplier, Company } from "@/types/purchase";
import savePO from '@/lib/api/purchase_orders'

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

type Product = {
  id: number;
  name: string;
  composition: string;
  pack: string;
  oldMRP: number;
  newMRP: number;
  rate: number;
  hsn: string;
  category: string;
  gst: number;
  status: string;
};

type PurchaseItem = Product & {
  qty: number;
  igst: number;
  cgst: number;
  sgst: number;
};

type PurchaseOrderDetails = {
  number: string;
  date: string;
};

export default function PurchaseOrder({ username }: { username?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [poItems, setPoItems] = useState<PurchaseItem[]>([]);
  const [supplier, setSupplier] = useState<Supplier>({
    id: 0,
    name: "",
    address: "",
    gstin: "",
  });
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrderDetails>({
    number: "",
    date: new Date().toISOString().slice(0, 10),
  });

  // Supplier Search states
  const [suppliers] = useState<Supplier[]>([
    { id:1, name: "Sun Pharma Pvt. Ltd.", address: "Mumbai, Maharashtra", gstin: "27AAACS0742A1Z3" },
    { id:2, name: "Cipla Ltd.", address: "Bangalore, Karnataka", gstin: "29AAACC7247E1Z6" },
    { id:3, name: "Zydus Healthcare Ltd.", address: "Ahmedabad, Gujarat", gstin: "24AAACZ2295Q1Z1" },
    { id:4, name: "Dr. Reddy's Laboratories", address: "Hyderabad, Telangana", gstin: "36AAACD7999Q1Z7" },
  ]);

  

  // Product Search states
  const [searchTerm, setSearchTerm] = useState("");

  const [companies] = useState<Company[]>([
    {
      id:1,
      name: "Biophar Lifesciences Pvt. Ltd.",
      address: "Plot 25, Industrial Area, Chandigarh",
      gstin: "03ABCDE1234F1Z7",
    },
    {
      id:2,
      name: "Rechelist Pharma Pvt. Ltd.",
      address: "SCO 45, Phase 7, Mohali",
      gstin: "03XYZAB1234F1Z1",
    },
  ]);
  
  // Fetch product list
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Reset PO
  const resetPO = () => {
    if (window.confirm("Start a new purchase order? Unsaved data will be lost.")) {
      setSupplier({id:0, name: "", address: "", gstin: "" });
      setPurchaseOrder({ number: "", date: new Date().toISOString().slice(0, 10) });
      setPoItems([]);
      setSelectedProduct(null);
      setSearchTerm("");
    }
  };

  

  const addProduct = () => {
    if (!selectedProduct) return;
    setPoItems([...poItems, { ...selectedProduct, qty: 1, igst: 0, cgst: 0, sgst: 0 }]);
    setSelectedProduct(null);
    setSearchTerm("");
  };

  const handleItemChange = (index: number, field: keyof PurchaseItem, value: string | number) => {
    const updated = [...poItems];
    (updated[index] as any)[field] = value;
    setPoItems(updated);
  };

  const calculateBase = (item: PurchaseItem) => item.rate * item.qty;
  const calculateTax = (item: PurchaseItem) => {
    const base = calculateBase(item);
    const totalTaxPercent = (item.igst || 0) + (item.cgst || 0) + (item.sgst || 0);
    return (base * totalTaxPercent) / 100;
  };
  const calculateTotal = (item: PurchaseItem) => calculateBase(item) + calculateTax(item);

  const totalBeforeTax = poItems.reduce((acc, i) => acc + calculateBase(i), 0).toFixed(2);
  const totalTaxValue = poItems.reduce((acc, i) => acc + calculateTax(i), 0).toFixed(2);
  const grandTotal = poItems.reduce((acc, i) => acc + calculateTotal(i), 0).toFixed(2);

  const deleteProduct = (index: number) => {
    const updated = [...poItems];
    updated.splice(index, 1);
    setPoItems(updated);
  };

  // PDF generation same as before — omitted for brevity
  const generatePDF = () => {/* same as previous code */};

  const handleSavePO = async() => {
    if (!purchaseOrder.number) {alert("Enter PO Number"); return;}

    const payload = {
      po_number: purchaseOrder.number,
      po_date: purchaseOrder.date,
      supplier_id: supplier.id,
      company_id: selectedCompany?.id,
      grand_total: grandTotal,
      items: [] as {
      product_id: number;
      qty: number;
      rate: number;
      }[],
    };

    for (const item of poItems) {
      payload.items.push({
      product_id: item.id,
      qty: item.qty,
      rate: item.rate,
      });
    }

    const response = await savePO(payload)
    resetPO()
    return
  };


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Purchase Order</h1>

        {/* Company Selection */}
        <CompanySelector
          companies={companies}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
        />

        {/* Supplier Search Dropdown */}
        <SupplierSelector 
          suppliers={suppliers} 
          setSupplier={setSupplier}  
        />

        {/* Auto-filled supplier details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Supplier Address"
            value={supplier.address}
            onChange={(e) => setSupplier({ ...supplier, address: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="GSTIN"
            value={supplier.gstin}
            onChange={(e) => setSupplier({ ...supplier, gstin: e.target.value })}
            className="border p-2 rounded"
          />
          
        </div>
        {/* PO Details */}
        <div className="flex flex-row gap-8 ">
          <div className="flex gap-4 items-center">
            <label className="font-bold">PO Number</label>
            <input
              type="text"
              placeholder="PO Number"
              value={purchaseOrder.number}
              onChange={(e) => setPurchaseOrder({ ...purchaseOrder, number: e.target.value })}
              className="border p-2 rounded"
              required
            />
          </div>
          <div className="flex gap-4 items-center">
            <label className="font-bold">PO Date</label>
            <input
              type="date"
              value={purchaseOrder.date}
              onChange={(e) => setPurchaseOrder({ ...purchaseOrder, date: e.target.value })}
              className="border p-2 rounded"
            />
          </div>
        </div>

        {/* Product Search with Highlight and Key Navigation */}
        <label className="mt-8 block text-sm font-semibold mb-1">
          Search Product and click ADD button
        </label>
        <div className="flex gap-2 mb-4 relative">
          <ProductSearch 
            products={products} 
            setSelectedProduct={setSelectedProduct}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <button
            onClick={() => {
              if (selectedProduct) {
                addProduct();
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                {[
                  "S.No",
                  "Product",
                  "Composition",
                  "Category",
                  "Pack",
                  "MRP",
                  "Qty",
                  "Rate",
                  "IGST%",
                  "CGST%",
                  "SGST%",
                  "Tax (₹)",
                  "Total (₹)",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th key={h} className="border p-2">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {poItems.map((item, i) => (
                <tr key={i} className="text-center">
                  <td className="border p-2">{i + 1}</td>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.composition}</td>
                  <td className="border p-2">{item.category}</td>
                  <td className="border p-2">{item.pack}</td>
                  <td className="border p-2">{item.newMRP}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleItemChange(i, "qty", +e.target.value)}
                      className="w-15 px-2 py-1 border border-gray-300 rounded-md shadow-sm 
                                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 
                                transition-all duration-150 text-center"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(i, "rate", +e.target.value)}
                      className="w-15 px-2 py-1 border border-gray-300 rounded-md shadow-sm 
                                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 
                                transition-all duration-150 text-center"
                    />
                  </td>
                  {["igst", "cgst", "sgst"].map((tax) => (
                    <td key={tax} className="border p-2">
                      <input
                        type="number"
                        value={(item as any)[tax]}
                        onChange={(e) =>
                          handleItemChange(i, tax as keyof PurchaseItem, +e.target.value)
                        }
                        className="w-10 border rounded text-center"
                      />
                    </td>
                  ))}
                  <td className="border p-2">₹{calculateTax(item).toFixed(2)}</td>
                  <td className="border p-2 font-semibold">
                    ₹{calculateTotal(item).toFixed(2)}
                  </td>
                  <td className="border p-2">
                    <input
                      value={item.status}
                      onChange={(e) => handleItemChange(i, "status", +e.target.value)}
                      className="w-15 px-2 py-1 border border-gray-300 rounded-md shadow-sm 
                                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 
                                transition-all duration-150 text-center"
                    />
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => deleteProduct(i)}
                      className="bg-red-500 text-white text-xs px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mt-6 flex-col items-end space-y-2">
          <p>Total Before Tax: ₹{totalBeforeTax}</p>
          <p>Total Tax: ₹{totalTaxValue}</p>
          <p className="text-lg font-bold">Grand Total: ₹{grandTotal}</p>
          <div className="flex gap-3 mt-3">
            <button onClick={generatePDF} className="bg-green-600 text-white px-6 py-2 rounded">
              Download PO
            </button>
            <button onClick={resetPO} className="bg-red-500 text-white px-6 py-2 rounded">
              New PO
            </button>
            <button onClick={handleSavePO} className="bg-red-500 text-white px-6 py-2 rounded">
              Save PO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
