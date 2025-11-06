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
};

export default function UserProductsPage() {

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
      const fetchProducts = async () => {
          try {
          const data = await getAllProducts();
          console.log(data)
          setProducts(data);
          } catch (err) {
          console.error("Error fetching products:", err);
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
      <ProductsGrid products={products} />
    </div>
  );
}
