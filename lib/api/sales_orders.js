// /lib/api/sales_orders.ts

export async function createSalesOrder(payload) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/po/create-sales-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("API Error:", errorText);
    throw new Error("Failed to create sales order");
  }

  return await res.json();
}
