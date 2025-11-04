// src/app/dashboard/user/products/page.tsx
"use client";

import { products } from "@/data/products";

export default function UserProductsPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-slate-500 text-sm mt-1">Browse our available company products.</p>
        </div>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white border rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition"
          >
            <img
              src={p.image}
              alt={p.name}
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <p className="text-slate-500 text-sm mt-1">{p.category}</p>

              <div className="flex items-center justify-between mt-3">
                <span className="font-medium text-sky-600">₹{p.price}</span>
                <span
                  className={`text-sm ${
                    p.stock > 100 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                </span>
              </div>

              <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                {p.description}
              </p>

              <button className="mt-4 w-full bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600">
                View Details
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
