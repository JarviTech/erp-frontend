"use client";

import { useEffect, useState } from "react";

type Supplier = {
  id: number;
  name: string;
  email?: string;
  contact?: string;
  address?: string;
  gstin?: string;
  categories?: string[];
};

export default function SuppliersList() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const openModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSupplier(null);
    setModalOpen(false);
  };

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
                <th className="py-3 px-4 border-b">Actions</th>
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
                  <td className="py-3 px-4 border-b uppercase">
                    {supplier.address || "-"}
                  </td>
                  <td className="py-3 px-4 border-b">
                    <button
                      onClick={() => openModal(supplier)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-md transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Supplier Details
            </h2>
            <div className="space-y-2">
              <p>
                <strong>ID:</strong> {selectedSupplier.id}
              </p>
              <p>
                <strong>Name:</strong> {selectedSupplier.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedSupplier.email || "-"}
              </p>
              <p>
                <strong>Phone:</strong> {selectedSupplier.contact || "-"}
              </p>
              <p>
                <strong>GSTIN:</strong> {selectedSupplier.gstin || "-"}
              </p>
              <p>
                <strong>Address:</strong> {selectedSupplier.address || "-"}
              </p>
              <p>
                <strong>Categories:</strong>{" "}
                {selectedSupplier.categories && selectedSupplier.categories.length > 0 ? (
                  <span className="flex flex-wrap gap-1">
                    {selectedSupplier.categories.map((cat) => (
                      <span
                        key={cat}
                        className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </span>
                ) : (
                  "-"
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
