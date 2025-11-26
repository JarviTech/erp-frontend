

export async function createSupplier(payload) {

    try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/po/create-supplier`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Something went wrong");
    }

    const data = await res.json();
    return data;

  } catch (error) {
    throw new Error(error.message);
    console.error("Error in API", error);
    alert("Failed to create supplier: " + error.message);
  }  
  
  return data;
}

export async function fetchSuppliers() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/po/get-suppliers`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }); 
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Something went wrong");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
    console.error("Error in API", error);
    alert("Failed to fetch suppliers: " + error.message);
  }
}