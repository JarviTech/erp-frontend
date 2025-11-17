export type Company = {
  id: number;
  name: string;
  address: string;
  gstin: string;
};

export type Supplier = {
  id: number;
  name: string;
  address: string;
  gstin: string;
};

export type Product = {
  id: number;
  name: string;
  composition: string;
  pack: string;
  oldMRP: number;
  newMRP: number;
  rate: number;
  hsn: string;
  category: string;
  gst: number;
  status: string;
};

export type PurchaseItem = Product & {
  qty: number;
  igst: number;
  cgst: number;
  sgst: number;
};

export type PurchaseOrderDetails = {
  number: string;
  date: string;
};

export type PurchaseOrderItems = {
  product_id: number,
  qty: number,
  rate: number
}

export type PurchaseOrderCreatePayload = {
  po_number: string,
  po_date: string,
  supplier_id: number,
  company_id: number,
  grand_total: number,
  items: [PurchaseOrderItems]
}
