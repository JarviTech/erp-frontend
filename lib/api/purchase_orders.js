

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