import { api } from "./api";

export interface Table {
  id: string;
  name: string;
  orders?: [];
}

export interface CreateTable {
  name: string;
  restaurantId: string | undefined;
}

export interface PatchTable {
  name: string;
  id: string;
  restaurantId: string;
}

export async function getTables(restaurantId: string | undefined) {
  if (!restaurantId) {
    throw new Error("Nenhum restaurante selecionado");
  }

  try {
    const response = await api.get<Table[]>(
      `tables/restaurant/${restaurantId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

export async function getOrdersByTableId(tableId: string) {
  try {
    const response = await api.get(`/orders/table/${tableId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao obter comandas: ${error}`);
  }
}

export async function createTable({ name, restaurantId }: CreateTable) {
  try {
    const response = await api.post<CreateTable>(`/tables`, {
      name,
      restaurantId,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao criar mesa: ${error}`);
  }
}

export async function deleteTable(tableId: string | undefined) {
  if (!tableId) {
    throw new Error(`ID da mesa não definido`);
  }

  try {
    const response = await api.delete(`/tables/${tableId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao deletar mesa: ${error}`);
  }
}

export async function patchTable(i: PatchTable) {
  if (!i) {
    throw new Error("Erro ao editar mesa");
  }

  try {
    const response = await api.patch<PatchTable>(`/tables`, i);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao editar mesa: ${error}`);
  }
}
