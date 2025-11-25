import { useState, useEffect, useRef } from "react";
import ProductStatusUpdate from "./ProductStatusUpdate";

export default function ProductWiseView({ groups }: { groups: any }) {
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const productNames = Object.keys(groups);

  const filteredProducts = search.trim()
    ? productNames.filter((name) =>
        name.toLowerCase().includes(search.toLowerCase())
      )
    : productNames;

  /** Close dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** Highlight matching text */
  const highlightMatch = (text: string) => {
    const regex = new RegExp(`(${search})`, "gi");
    return text.replace(regex, `<span class="bg-yellow-200 font-semibold">$1</span>`);
  };

  /** Handle keyboard navigation */
  const handleKeyDown = (e: any) => {
    if (!dropdownOpen) setDropdownOpen(true);

    // Arrow Down
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < filteredProducts.length - 1 ? prev + 1 : prev
      );
    }

    // Arrow Up
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }

    // Enter
    if (e.key === "Enter" && activeIndex >= 0) {
      setSearch(filteredProducts[activeIndex]);
      setDropdownOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* SEARCH BAR */}
      <div className="relative w-1/2 mb-4" ref={inputRef}>
        <input
          type="text"
          placeholder="Search product..."
          className="w-full border p-2 rounded"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setDropdownOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setDropdownOpen(true)}
        />

        {/* AUTOCOMPLETE DROPDOWN */}
        {dropdownOpen && search.length > 0 && (
          <div className="absolute bg-white border rounded shadow w-full max-h-48 overflow-y-auto z-10">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((name, i) => (
                <div
                  key={i}
                  className={`p-2 cursor-pointer ${
                    i === activeIndex ? "bg-blue-100" : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setSearch(name);
                    setDropdownOpen(false);
                  }}
                  dangerouslySetInnerHTML={{ __html: highlightMatch(name) }}
                />
              ))
            ) : (
              <div className="p-2 text-gray-500">No results</div>
            )}
          </div>
        )}
      </div>

      {/* PRODUCT GROUP TABLES */}
      {filteredProducts.map((prod, idx) => (
        <div key={idx} className="border p-4 rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-3">{prod}</h2>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border w-[12%]">PO Number</th>
                <th className="p-2 border w-[10%]">PO Date</th>
                <th className="p-2 border">Supplier</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Rate</th>
                <th className="p-2 border w-10">Status</th>
              </tr>
            </thead>
            <tbody>
              {groups[prod].map((item: any, i: number) => (
                <ProductStatusUpdate key={i} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
