import { api } from './api';

export interface UpdateOrderProductStatus {
  orderProductId: string;
  status: string;
}

export interface UpdateOrderProductQuantity {
  orderProductId: string;
  quantity: number;
}


export async function updateStatusOnProduct(data: UpdateOrderProductStatus) {

  try {
    const response = await api.patch("/order-product/status", data);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao atualizar status do produto:", error?.response?.data || error.message);
    throw error;
  }
}

export async function updateQuantityOnProduct(data: UpdateOrderProductQuantity) {

  try {
    const response = await api.patch("/order-product/quantity", data);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao atualizar quantidade do produto:", error?.response?.data || error.message);
    throw error;
  }
}

export async function updateCustomObservation(productId: string) {

  try {
    const response = await api.patch(`/order-product/custom/${productId}`);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao atualizar observação do produto:", error?.response?.data || error.message);
    throw error;
  }
}

export async function deleteProductFromOrder(productId: string) {

  try {
    const response = await api.delete(`/order-product/${productId}`);

    return response.data;
  } catch (error: any) {
    console.error("Erro ao deletar produto do pedido:", error?.response?.data || error.message);
    throw error;
  }
}
