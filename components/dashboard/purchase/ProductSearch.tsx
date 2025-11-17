"use client";

import { Product } from "@/types/purchase";
import { useState } from "react";

export default function ProductSearch({
  products,
  setSelectedProduct,
  searchTerm,
  setSearchTerm,
}: {
  products: Product[];
  setSelectedProduct: (p: Product | null) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Type product name..."
        value={searchTerm}
        onChange={(e) => {
          const value = e.target.value;
          setSearchTerm(value);
          setShowDropdown(true);
          setSelectedProduct(null);   // Your logic preserved
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
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : prev
            );
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
                    i === highlightedIndex
                      ? "bg-blue-100"
                      : "hover:bg-blue-50"
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
            <div className="p-2 text-gray-500 text-sm">
              No matching products
            </div>
          )}
        </div>
      )}
    </div>
  );
}
