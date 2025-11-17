"use client";

import { Supplier } from "@/types/purchase";
import { useState } from "react";

export default function SupplierSelector({
  suppliers,
  setSupplier,
}: {
  suppliers: Supplier[];
  setSupplier: (s: Supplier) => void;
}) {
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <label className="block text-sm font-semibold mb-1">Select Supplier</label>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Type supplier name..."
          value={search}
          onChange={(e) => {
            const val = e.target.value;
            setSearch(val);
            setShow(true);
            setHighlight(-1);
          }}
          onFocus={() => setShow(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlight((prev) =>
                prev < filtered.length - 1 ? prev + 1 : prev
              );
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlight((prev) => (prev > 0 ? prev - 1 : prev));
            } else if (e.key === "Enter" && highlight >= 0) {
              e.preventDefault();
              const selected = filtered[highlight];
              setSupplier(selected);
              setSearch(selected.name);
              setShow(false);
            } else if (e.key === "Escape") {
              setShow(false);
            }
          }}
          className="border p-2 rounded w-full"
        />

        {show && search && (
          <div className="absolute z-10 bg-white border rounded w-full max-h-48 overflow-y-auto shadow">
            {filtered.slice(0, 10).map((s, i) => {
              const matchIndex = s.name
                .toLowerCase()
                .indexOf(search.toLowerCase());

              const before = s.name.slice(0, matchIndex);
              const match = s.name.slice(matchIndex, matchIndex + search.length);
              const after = s.name.slice(matchIndex + search.length);

              return (
                <div
                  key={i}
                  onClick={() => {
                    setSupplier(s);
                    setSearch(s.name);
                    setShow(false);
                  }}
                  className={`p-2 cursor-pointer ${
                    i === highlight ? "bg-blue-100" : "hover:bg-blue-50"
                  }`}
                >
                  <span>
                    {before}
                    <span className="font-bold text-blue-700">{match}</span>
                    {after}
                  </span>
                  <span className="text-sm text-gray-500"> — {s.address}</span>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="p-2 text-gray-500 text-sm">No matching suppliers</div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
