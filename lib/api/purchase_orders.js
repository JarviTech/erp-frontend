

export default async function savePO(payload) {
  console.log("PO DATA", payload);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/po/create-po`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Failed: ${res.status}`);
      }

      const data = await res.json();
      console.log("PO Saved Successfully:", data);
      alert("PO Created Successfully!");
      return data;

    } catch (error) {
      console.error("Error saving PO:", error);
      alert("Failed to save PO");
    }
    return 
}

export async function getNextPONumber() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/po/next-po-number`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!res.ok) {
        throw new Error(`Failed: ${res.status}`);
      }

      const data = await res.json();
      return data.next_po_number;

    } catch (error) {
      console.error("Error fetching Next PO Number:", error);
    }
    return ;
}

export async function updateProductStatus(po_number, status, product_id) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/po/update-product-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          po_number: po_number,
          status: status,
          product_id: product_id,
        }),
      });
    } catch (error) {
      throw new Error("Failed to update status", error);
    }
    return ;
}

