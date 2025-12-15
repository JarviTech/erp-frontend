

export async function getAllCustomers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/po/get-all-customers`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}