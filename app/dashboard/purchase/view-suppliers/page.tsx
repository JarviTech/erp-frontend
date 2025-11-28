"use client";

import { useEffect, useState } from "react";

type Supplier = {
  id: number;
  name: string;
  email?: string;
  contact?: string;
  address?: string;
  gstin?: string;
};

export default function SuppliersList() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/po/get-suppliers`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch suppliers");
        }

        const data = await res.json();
        setSuppliers(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  if (loading)
    return (
      <div className="text-center py-10 text-lg font-semibold text-gray-600">
        Loading suppliers...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-500 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Supplier Directory
      </h1>

      {suppliers.length === 0 ? (
        <p className="text-gray-600 text-center">No suppliers found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                <th className="py-3 px-4 border-b">ID</th>
                <th className="py-3 px-4 border-b">Supplier Name</th>
                <th className="py-3 px-4 border-b">Email</th>
                <th className="py-3 px-4 border-b">Phone</th>
                <th className="py-3 px-4 border-b">GST No</th>
                <th className="py-3 px-4 border-b">Address</th>
              </tr>
            </thead>

            <tbody>
              {suppliers.map((supplier, index) => (
                <tr
                  key={supplier.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="py-3 px-4 border-b">{supplier.id}</td>
                  <td className="py-3 px-4 border-b font-medium text-gray-800">
                    {supplier.name}
                  </td> 
                  <td className="py-3 px-4 border-b">{supplier.email || "-"}</td>
                  <td className="py-3 px-4 border-b">{supplier.contact || "-"}</td>
                  <td className="py-3 px-4 border-b uppercase">{supplier.gstin || "-"}</td>
                  <td className="py-3 px-4 border-b uppercase">{supplier.address || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
