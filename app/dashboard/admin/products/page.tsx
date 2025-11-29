// src/app/dashboard/user/products/page.tsx
"use client";

import ProductsGrid from "@/components/products/ProductsGrid";
import { useEffect, useState } from "react";
import { getAllProducts } from "@/lib/api/product";

type Product = {
  id: number;
  image: string;
  name: string;
  composition: string;
  pack: string;
  oldMRP: number;
  newMRP: number;
  rate: number;
  hsn: string;
  gst: number;
  launch_date: Date;
  catergory: string;
  speciality: string;
};

export default function AdminProductsPage() {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
      const fetchProducts = async () => {
          try {
          setLoading(true);
          const data = await getAllProducts();
          // console.log(data)
          setProducts(data);
          } catch (err) {
          console.error("Error fetching products:", err);
          } finally {
            setLoading(false);
          }
      };
  
    fetchProducts();
  
  }, []);


  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-slate-500 text-sm mt-1">Browse our available company products.</p>
        </div>
      </header>
      {loading ? (
        <p className="text-center font-bold text-3xl">Loading products...</p>
      ) : (
        <ProductsGrid products={products} role={1}/>
      )}
    </div>
  );
}
