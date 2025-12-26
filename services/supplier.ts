import { api } from "./api";

export interface Supplier {
  id: string;
  name: string;
  taxId?: string;
  contact?: string;
}

export async function getSuppliers(): Promise<Supplier[]> {
  const response = await api.get("/supplier");
  return response.data;
}

export async function getSupplierById(id: string): Promise<Supplier> {
  const response = await api.get(`/supplier/${id}`);
  return response.data;
}

export async function createSupplier(data: {
  name: string;
  taxId?: string;
  contact?: string;
}) {
  const response = await api.post("/supplier", data);
  return response.data;
}

export async function updateSupplier(
  id: string,
  data: {
    name?: string;
    taxId?: string;
    contact?: string;
  }
) {
  const response = await api.patch(`/supplier/${id}`, data);
  return response.data;
}

export async function deleteSupplier(id: string) {
  const response = await api.delete(`/supplier/${id}`);
  return response.data;
}
