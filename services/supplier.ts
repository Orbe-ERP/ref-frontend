import { api } from "./api";

export interface Supplier {
  id: string;
  name: string;
  taxId?: string;
  contact?: string;
}

export async function getSuppliers(): Promise<Supplier[]> {
  try {
    const response = await api.get("/suppliers");
    return response.data;
  } catch (error) {
    throw new Error(`Error on supplier: ${error}`);
  }
}

export async function getSupplierById(id: string): Promise<Supplier> {
  try {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error on supplier: ${error}`);
  }
}

export async function createSupplier(data: {
  name: string;
  restaurantId: string;
  taxId?: string;
  contact?: string;
}) {
  try {
    const response = await api.post("/suppliers", data);
    return response.data;
  } catch (error) {
    throw new Error(`Error on supplier: ${error}`);
  }
}

export async function updateSupplier(
  id: string,
  data: {
    name?: string;
    taxId?: string;
    contact?: string;
  }
) {
  try {
    const response = await api.patch(`/suppliers/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(`Error on supplier: ${error}`);
  }
}

export async function deleteSupplier(id: string) {
  try {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error on supplier: ${error}`);
  }
}
