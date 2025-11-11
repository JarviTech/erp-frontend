//ALL PRODUCT RELATED API CALLS


export async function getAllProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/getProducts`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function addNewProduct(productData) {
  // console.log("Adding product with data:", productData);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/add_new_product`, {
    method: "POST",
    body: productData,
  });
  if (!res.ok) throw new Error("Failed to add product");
  return res.json();
}
