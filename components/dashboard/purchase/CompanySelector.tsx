"use client";

import { Company } from "@/types/purchase";

export default function CompanySelector({
  companies,
  selectedCompany,
  setSelectedCompany,
}: {
  companies: Company[];
  selectedCompany: Company | null;
  setSelectedCompany: (c: Company | null) => void;
}) {
  return (
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
  );
}
