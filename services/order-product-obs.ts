import { api } from './api';

export interface CreateObservationLink {
  orderProductId: string;
  observationId: string;
}

export async function createObservationLink(data: CreateObservationLink) {
  try {
    const response = await api.post("/order-product-observation", data);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar link de observação:", error?.response?.data || error.message);
    throw error;
  }
}

export async function deleteObservationLink(id: string) {
  try {
    const response = await api.delete(`/order-product-observation/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao deletar link de observação:", error?.response?.data || error.message);
    throw error;
  }
}
