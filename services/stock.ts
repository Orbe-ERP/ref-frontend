import { api } from "./api";

export enum Unit {
  UNIT = "UNIT",
  GRAM = "GRAM",
  KILOGRAM = "KILOGRAM",
  MILLILITER = "MILLILITER",
  LITER = "LITER",
  PACKAGE = "PACKAGE",
  OTHER = "OTHER"
}

export interface StockItem {
  id: string;
  restaurantId: string;
  name: string;
  unit?: Unit;
  quantity: number;
  minimum?: number;
  lastCost?: number;
  costAverage?: number;
}

export interface CreateStockItemInput {
  restaurantId: string;
  name: string;
  unit?: Unit;
  quantity?: number;
  minimum?: number;
  lastCost?: number;
}

export async function createStockItem(data: CreateStockItemInput) {
  if (!data) throw new Error("Need data to create stock item");

  try {
    const response = await api.post("/stock", data);
    return response.data;
  } catch (error) {
    throw new Error(`Error creating stock item: ${error}`);
  }
}

export async function getStockItems(restaurantId: string): Promise<StockItem[]> {
  if (!restaurantId) throw new Error("No restaurant selected");

  try {
    const response = await api.get(`/stock/restaurant/${restaurantId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching stock items: ${error}`);
  }
}

export async function getStockById(id: string) {
  if (!id) throw new Error("Stock item ID is required");

  try {
    const response = await api.get(`/stock/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching stock item: ${error}`);
  }
}

export async function updateStockItem(id: string, data: any) {
  if (!id) throw new Error("Stock item ID is required");

  try {
    const response = await api.patch(`/stock/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(`Error updating stock item: ${error}`);
  }
}

export async function deleteStockItem(id: string) {
  if (!id) throw new Error("Stock item ID is required");

  try {
    await api.delete(`/stock/${id}`);
    return;
  } catch (error) {
    throw new Error(`Error deleting stock item: ${error}`);
  }
}

export async function consumeStock(
  items: { stockItemId: string; quantity: number; reference?: string }[]
) {
  if (!items || items.length === 0)
    throw new Error("items list cannot be empty");

  try {
    const response = await api.post("/stock/consume", { items });
    return response.data;
  } catch (error) {
    throw new Error(`Error consuming stock: ${error}`);
  }
}

export async function addStockPurchase(
  purchaseId: string,
  items: { stockItemId: string; quantity: number; unitCost: number }[]
) {
  if (!purchaseId) throw new Error("purchaseId is required");

  try {
    const response = await api.post(`/stock/purchase/${purchaseId}`, {
      items,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error adding purchase: ${error}`);
  }
}

export async function adjustStock(
  stockItemId: string,
  delta: number,
  note?: string
) {
  if (!stockItemId) throw new Error("stockItemId is required");

  try {
    const response = await api.post(`/stock/adjust/${stockItemId}`, {
      delta,
      note,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error adjusting stock: ${error}`);
  }
}
