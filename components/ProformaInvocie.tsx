"use client";

import { useEffect, useState, ChangeEvent } from "react";
import jsPDF from "jspdf";
// import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { getAllProducts } from "@/lib/api/product";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

type Company = {
  name: string;
  address: string;
  gstin: string;
};


type Product = {
  name: string;
  composition: string;
  pack: string;
  oldMRP: number;
  newMRP: number;
  rate: number;
  hsn: string;
};

type InvoiceItem = Product & {
  qty: number;
  igst: number;
  cgst: number;
  sgst: number;
};

type PartyDetails = {
  name: string;
  address: string;
  gstin: string;
};

type InvoiceDetails = {
  number: string;
  date: string;
};

export default function ProformaInvoice({username}:{username?:string}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const [party, setParty] = useState<PartyDetails>({
      name: "",
      address: "",
      gstin: "",
    });
    const [invoice, setInvoice] = useState<InvoiceDetails>({
      number: "",
      date: new Date().toISOString().slice(0, 10),
    });

    const [companies] = useState<Company[]>([
    {
        name: "Biophar Lifesciences Pvt. Ltd.",
        address: "Plot 25, Industrial Area, Chandigarh",
        gstin: "03ABCDE1234F1Z7",
    },
    {
        name: "Rechelist Pharma Pvt. Ltd.",
        address: "SCO 45, Phase 7, Mohali",
        gstin: "03XYZAB1234F1Z1",
    },
    ]);

    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);


    const resetInvoice = () => {
      if (window.confirm("Start a new invoice? Unsaved data will be lost.")) {
        setParty({ name: "", address: "", gstin: "" });
        setInvoice({ number: "", date: new Date().toISOString().slice(0, 10) });
        setInvoiceItems([]);
        setSelectedProduct(null);
      }
    };



  // Load product list
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

  const handleProductSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const product = products.find((p) => p.name === e.target.value);
    setSelectedProduct(product || null);
  };

  const addProduct = () => {
    if (!selectedProduct) return;
    setInvoiceItems([
      ...invoiceItems,
      { ...selectedProduct, qty: 1, igst: 0, cgst: 0, sgst: 0 },
    ]);
    setSelectedProduct(null);
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const updated = [...invoiceItems];
    (updated[index] as any)[field] = value;
    setInvoiceItems(updated);
  };

  const calculateBase = (item: InvoiceItem): number => item.rate * item.qty;

  const calculateTax = (item: InvoiceItem): number => {
    const base = calculateBase(item);
    const totalTaxPercent =
      (item.igst || 0) + (item.cgst || 0) + (item.sgst || 0);
    return (base * totalTaxPercent) / 100;
  };

  const calculateTotal = (item: InvoiceItem): number =>
    calculateBase(item) + calculateTax(item);

  const totalBeforeTax = invoiceItems
    .reduce((acc, item) => acc + calculateBase(item), 0)
    .toFixed(2);

  const totalTaxValue = invoiceItems
    .reduce((acc, item) => acc + calculateTax(item), 0)
    .toFixed(2);

  const grandTotal = invoiceItems
    .reduce((acc, item) => acc + calculateTotal(item), 0)
    .toFixed(2);

  const generatePDF = () => {
    // Create a new PDF in LANDSCAPE mode
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
    });

    // Company Header
    doc.setTextColor(0, 128, 255); // Sets the color to cyan
    doc.text(selectedCompany?.name || "OUR COMPANY NAME", 14, 20);
    doc.setTextColor(0, 0, 0); // Sets the color to black
    doc.setFontSize(9);
    doc.text(selectedCompany?.address || "", 14, 26);
    doc.text(`GSTIN: ${selectedCompany?.gstin || ""}`, 14, 32);
    doc.setFontSize(10);

    // Invoice Info
    doc.setFontSize(12);
    doc.text("Proforma Invoice", 250, 15, { align: "right" });
    doc.setFontSize(9);
    doc.text(`Invoice No: ${invoice.number}`, 250, 21, { align: "right" });
    const formattedDate = new Date(invoice.date).toLocaleDateString("en-GB");
    doc.text(`Date: ${formattedDate}`, 250, 26, { align: "right" });


    // Party Info Box
    doc.setFontSize(10);
    doc.text("Party Details:", 14, 36);
    doc.text(`Name: ${party.name || "-"}`, 14, 42);
    doc.text(`Address: ${party.address || "-"}`, 14, 47);
    doc.text(`GSTIN: ${party.gstin || "-"}`, 14, 52);

    // Table Data
    const rows = invoiceItems.map((item, i) => {
        const taxableValue = item.rate * item.qty;
        const igstAmt = taxableValue * (item.igst / 100);
        const cgstAmt = taxableValue * (item.cgst / 100);
        const sgstAmt = taxableValue * (item.sgst / 100);
        const totalTax = igstAmt + cgstAmt + sgstAmt;
        const totalAmt = taxableValue + totalTax;

        return [
        i + 1,
        item.name,
        item.composition,
        item.pack,
        item.rate.toFixed(2),
        item.qty,
        item.hsn,
        `${item.igst}%`,
        `${item.cgst}%`,
        `${item.sgst}%`,
        totalTax.toFixed(2),
        totalAmt.toFixed(2),
        ];
    });

    // Add Table
    autoTable(doc, {
        startY: 58,
        head: [
        [
            "S.No",
            "Product Name",
            "Composition",
            "Pack",
            "Rate",
            "Qty",
            "HSN",
            "IGST%",
            "CGST%",
            "SGST%",
            "Tax ",
            "Total",
        ],
        ],
        body: rows.length > 0 ? rows : [["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]],
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [0, 128, 255], textColor: 255, halign: "center" },
        columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 45 },
        3: { halign: "center", cellWidth: 20 },
        4: { halign: "right", cellWidth: 20 },
        5: { halign: "center", cellWidth: 15 },
        6: { halign: "center", cellWidth: 20 },
        7: { halign: "center", cellWidth: 15 },
        8: { halign: "center", cellWidth: 15 },
        9: { halign: "center", cellWidth: 15 },
        10: { halign: "right", cellWidth: 20 },
        11: { halign: "right", cellWidth: 25 },
        },
    });

    // Total Summary
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    const grandTotal = invoiceItems.reduce((sum, item) => {
        const taxableValue = item.rate * item.qty;
        const igstAmt = taxableValue * (item.igst / 100);
        const cgstAmt = taxableValue * (item.cgst / 100);
        const sgstAmt = taxableValue * (item.sgst / 100);
        return sum + taxableValue + igstAmt + cgstAmt + sgstAmt;
    }, 0);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Before Tax: INR. ${totalBeforeTax}`, 250, finalY, { align: "right" });
    doc.text(`Total Tax:INR. ${totalTaxValue}`, 250, finalY+10, { align: "right" });
    doc.text(`Grand Total: INR. ${grandTotal.toFixed(2)}`, 250, finalY+20, { align: "right" });
    
    // Footer
    doc.setFontSize(9);
    doc.text(`Created by : ${username}`, 14, 200);
    doc.text("For Biophar Lifesciences Pvt. Ltd.", 250, 200, { align: "right" });

    // Save PDF
    doc.save(`Proforma_${invoice.number || "Draft"}.pdf`);  
};

  const deleteProduct = (index: number) => {
    const updated = [...invoiceItems];
    updated.splice(index, 1);
    setInvoiceItems(updated);
  };


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Proforma Invoice</h1>
        {/* Our Company Details Section */}
        <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Select Our Company</label>
            <select
                className="border p-2 rounded w-full"
                value={selectedCompany?.name || ""}
                onChange={(e) => {
                const comp = companies.find((c) => c.name === e.target.value);
                setSelectedCompany(comp || null);
                }}
            >
                <option value="">Select Company</option>
                {companies.map((c, i) => (
                <option key={i} value={c.name}>
                    {c.name}
                </option>
                ))}
            </select>
            </div>


        {/* Party Info */}
        <label className="block text-sm font-semibold mb-1">Enter Party Details Manually</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            
            <input
                type="text"
                placeholder="Party Name"
                value={party.name}
                onChange={(e) => setParty({ ...party, name: e.target.value })}
                className="border p-2 rounded"
            />
            <input
                type="text"
                placeholder="Address"
                value={party.address}
                onChange={(e) => setParty({ ...party, address: e.target.value })}
                className="border p-2 rounded"
            />
            <input
                type="text"
                placeholder="GSTIN"
                value={party.gstin}
                onChange={(e) => setParty({ ...party, gstin: e.target.value })}
                className="border p-2 rounded"
            />
            <input
                type="text"
                placeholder="Invoice No"
                value={invoice.number}
                onChange={(e) => setInvoice({ ...invoice, number: e.target.value })}
                className="border p-2 rounded"
            />
            <input
                type="date"
                value={invoice.date}
                onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
                className="border p-2 rounded"
            />
        </div>

        {/* Product Select */}
        <label className="block text-sm font-semibold mb-1">
          Search Product and click ADD button
        </label>

        {/* Product Search Autocomplete */}
        <div className="flex gap-2 mb-4 relative">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Type product name..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                setShowDropdown(true);
                setSelectedProduct(null);
                setHighlightedIndex(-1);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={(e) => {
                const filtered = products.filter((p) =>
                  p.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setHighlightedIndex((prev) =>
                    prev < filtered.length - 1 ? prev + 1 : prev
                  );
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                } else if (e.key === "Enter" && highlightedIndex >= 0) {
                  e.preventDefault();
                  const selected = filtered[highlightedIndex];
                  setSelectedProduct(selected);
                  setSearchTerm(selected.name);
                  setShowDropdown(false);
                } else if (e.key === "Escape") {
                  setShowDropdown(false);
                }
              }}
              className="border p-2 rounded w-full"
            />

            {/* Dropdown */}
            {showDropdown && searchTerm && (
              <div className="absolute z-10 bg-white border rounded w-full max-h-48 overflow-y-auto shadow">
                {products
                  .filter((p) =>
                    p.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .slice(0, 10)
                  .map((p, i) => {
                    const matchIndex = p.name
                      .toLowerCase()
                      .indexOf(searchTerm.toLowerCase());
                    const before = p.name.slice(0, matchIndex);
                    const match = p.name.slice(
                      matchIndex,
                      matchIndex + searchTerm.length
                    );
                    const after = p.name.slice(matchIndex + searchTerm.length);

                    return (
                      <div
                        key={i}
                        onClick={() => {
                          setSelectedProduct(p);
                          setSearchTerm(p.name);
                          setShowDropdown(false);
                        }}
                        className={`p-2 cursor-pointer ${
                          i === highlightedIndex ? "bg-blue-100" : "hover:bg-blue-50"
                        }`}
                      >
                        <span>
                          {before}
                          <span className="font-bold text-blue-700">{match}</span>
                          {after}
                        </span>
                        <span className="text-sm text-gray-500">
                          {" "}
                          — {p.composition}
                        </span>
                      </div>
                    );
                  })}
                {products.filter((p) =>
                  p.name.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
                  <div className="p-2 text-gray-500 text-sm">No matching products</div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (selectedProduct) {
                addProduct();
                setSelectedProduct(null);
                setSearchTerm("");
                setHighlightedIndex(-1);
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>

        {/* Invoice Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                {[
                  "S.No",
                  "Product",
                  "Composition",
                  "Pack",
                  "Rate",
                  "Qty",
                  "HSN",
                  "IGST%",
                  "CGST%",
                  "SGST%",
                  "Tax (₹)",
                  "Total (₹)",
                  "Action", // 👈 Add this new header
                ].map((h) => (
                  <th key={h} className="border p-2">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoiceItems.map((item, i) => (
                <tr key={i} className="text-center">
                  <td className="border p-2">{i + 1}</td>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.composition}</td>
                  <td className="border p-2">{item.pack}</td>
                  <td className="border p-2">{item.rate}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleItemChange(i, "qty", +e.target.value)}
                      className="w-16 border rounded text-center"
                    />
                  </td>
                  <td className="border p-2">{item.hsn}</td>
                  {["igst", "cgst", "sgst"].map((tax) => (
                    <td key={tax} className="border p-2">
                      <input
                        type="number"
                        value={(item as any)[tax]}
                        onChange={(e) =>
                          handleItemChange(i, tax as keyof InvoiceItem, +e.target.value)
                        }
                        className="w-16 border rounded text-center"
                      />
                    </td>
                  ))}
                  <td className="border p-2">₹{calculateTax(item).toFixed(2)}</td>
                  <td className="border p-2 font-semibold">
                    ₹{calculateTotal(item).toFixed(2)}
                  </td>
                  {/* 🗑 Delete button */}
                  <td className="border p-2">
                    <button
                      onClick={() => deleteProduct(i)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>

        {/* Footer Totals */}
        <div className="flex justify-end mt-6 flex-col items-end space-y-2">
          <p>Total Before Tax: ₹{totalBeforeTax}</p>
          <p>Total Tax: ₹{totalTaxValue}</p>
          <p className="text-lg font-bold">Grand Total: ₹{grandTotal}</p>
          <div className="flex gap-3 mt-3">
            <button
              onClick={generatePDF}
              className="bg-green-600 text-white px-6 py-2 rounded"
            >
              Download PDF
            </button>

            <button
              onClick={resetInvoice}
              className="bg-red-500 text-white px-6 py-2 rounded"
            >
              New Invoice
            </button>
          </div>
      </div>
      </div>
    </div>
  );
}
