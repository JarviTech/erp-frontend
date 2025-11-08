"use client";
import React, { useState, useMemo } from "react";
import { Search, Copy, Download,Edit } from "lucide-react";

function ProductsGrid({ products, role }: { products: any[]; role?: number }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Helper: check if product is newly launched (within 30 days)
  const isNewlyLaunched = (launchDate: string) => {
    const launch = new Date(launchDate);
    const now = new Date();
    const diffDays = (now.getTime() - launch.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  };

  // Sort products by launch_date (recent first)
  const sortedProducts = useMemo(() => {
    return [...products].sort(
      (a, b) => new Date(b.launch_date).getTime() - new Date(a.launch_date).getTime()
    );
  }, [products]);

  // Filter products by prefix match on brand name or composition
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return sortedProducts;

    const lowerSearch = searchTerm.toLowerCase();
    return sortedProducts.filter(
      (p) =>
        p.name.toLowerCase().startsWith(lowerSearch) ||
        p.composition.toLowerCase().startsWith(lowerSearch)
    );
  }, [sortedProducts, searchTerm]);

    // Function to copy formatted text
    const handleCopy = (product: any) => {
        const formattedText = `
            📦 *${product.name}*
            💊 Composition: ${product.composition}
            💰 MRP: ₹${product.newMRP}
            🏷️ Rate: ₹${product.rate}
            🧾 Pack: ${product.pack}
            🔢 HSN: ${product.hsn}
            📅 Launch Date: ${new Date(product.launch_date)
                .toLocaleDateString("en-GB")
                .replace(/\//g, "-")}

            _${window.location.origin}${product.image ? product.image : ""}_
        `;

        navigator.clipboard.writeText(formattedText.trim());
        alert("✅ Product details copied! You can now paste in WhatsApp.");
    };

    const handleDownloadImage = async (p: any) => {
    try {
      const imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${p.image}`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = p.image.split("/").pop(); // get filename from path
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading image:", err);
      alert("❌ Failed to download image");
    }
  };

  return (
    <section className="w-full">
      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-6">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by product or composition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-sky-400 outline-none transition-all"
          />
        </div>
      </div>

      {/* Product Cards */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No matching products found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="relative bg-white border rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition"
            >
              {/*  Newly Launched Badge */}
              {isNewlyLaunched(p.launch_date) && (
                <span className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-red-400 text-white text-xs font-semibold px-3 py-1 rounded-full animate-pulse shadow-md">
                  ✨ New Launch
                </span>
              )}

              {/* Product Image */}
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${p.image}`}
                alt={p.name}
                className="h-40 w-full object-fit"
              />

              {/*  Product Details */}
              <div className="p-4">
                <h2 className="text-lg font-semibold truncate">{p.name}</h2>
                <h3 className="text-xs text-gray-500 mt-1 truncate">Biophar Lifesciences</h3>
                <p className="text-slate-500 text-sm mt-1 truncate">
                  {p.composition}
                </p>

                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold">Rate: ₹{p.rate}</span>
                  <span className="text-sm text-gray-500">Stock: </span>
                </div>

                <div className="flex flex-row justify-between mt-1 text-sm">
                  <span className="font-medium text-red-600">
                    Old MRP: ₹{p.oldMRP}
                  </span>
                  <span className="font-medium text-green-600">
                    New MRP: ₹{p.newMRP}
                  </span>
                </div>
                <div className="flex flex-row justify-between mt-1 text-sm">
                  <span className="font-medium">
                    Pack: {p.pack}
                  </span>
                  <span className="font-medium">
                    GST: {p.gst}%
                  </span>
                </div>

                <div className="mt-2 flex justify-between items-center gap-2">
                    <p className="text-xs text-slate-400 w-[70%] mt-2">
                        Launch Date:{" "}
                        {new Date(p.launch_date)
                        .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })
                        .replace(/\//g, "-")}
                    </p>
                    {/*Copy Button */}
                    <button
                    onClick={() => handleCopy(p)}
                    className="flex cursor-pointer justify-center text-white py-2 rounded-lg transition"
                    >
                        <Copy size={18} className="text-slate-700" />
                    </button>
                    <button
                        onClick={() => handleDownloadImage(p)}
                        className="flex cursor-pointer justify-center text-white py-2 rounded-lg transition"
                    >
                        <Download size={18} className="text-slate-700" />
                    </button>
                    {role === 5 && (
                    <button
                            // onClick={() => setIsOpen(true)}
                            className="text-white rounded-lg py-2 cursor-pointer transition"
                        >
                            <Edit size={18} className="text-slate-700" />
                        </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductsGrid;
