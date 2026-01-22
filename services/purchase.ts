import { api } from "./api";

export interface PurchaseItem {
  stockItemId: string;
  quantity: number;
  unitCost: number;
}

export interface Purchase {
  id: string;
  issuedAt: string;
  total: number;
  invoiceKey?: string;
  items: {
    id: string;
    purchaseId: string;
    quantity: number;
    stockItemId: string;
    totalCost: number;
    unitCost: number;
    createdAt: string;
  }[];
  supplier?: {
    id: string;
    name: string;
  };
}

export async function createManualPurchase(data: {
  restaurantId: string;
  supplierId?: string;
  issuedAt?: string;
  invoiceKey?: string;
  items: any;
}) {
  const response = await api.post("/purchase/manual", data);
  return response.data;
}

export async function addItemsToPurchase(
  purchaseId: string,
  items: PurchaseItem[],
) {
  if (!items.length) {
    throw new Error("A compra deve conter ao menos um item");
  }

  const response = await api.post(`/purchase/add/${purchaseId}`, {
    items,
  });

  return response.data;
}

export async function getPurchasesByRestaurant(
  restaurantId: string,
): Promise<Purchase[]> {
  const response = await api.get(`/purchase/restaurant/${restaurantId}`);
  return response.data;
}

export async function importPurchaseXml(data: {
  restaurantId: string;
  file: File;
}) {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("restaurantId", data.restaurantId);

  const response = await api.post("/purchase/import/xml", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function confirmPurchaseXml(data: any) {
  const response = await api.post("/purchase/import/xml/confirm", data);
  return response.data;
}

export function calculatePurchaseTotal(items: PurchaseItem[]): number {
  return items.reduce(
    (total, item) => total + item.quantity * item.unitCost,
    0,
  );
}

export function validatePurchaseItems(items: PurchaseItem[]) {
  const errors: string[] = [];

  if (!items.length) {
    errors.push("A compra deve conter pelo menos um item");
  }

  items.forEach((item, index) => {
    if (!item.stockItemId) {
      errors.push(`Item ${index + 1}: Produto não informado`);
    }
    if (item.quantity <= 0) {
      errors.push(`Item ${index + 1}: Quantidade inválida`);
    }
    if (item.unitCost < 0) {
      errors.push(`Item ${index + 1}: Custo inválido`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export async function matchStockItem(restaurantId: string, name: string) {
  const { data } = await api.get("/stock/suggestions", {
    params: {
      restaurantId,
      name,
    },
  });

  const best = data?.[0];

  if (!best) {
    return null;
  }

  return {
    stockItemId: best.id,
    confidence: best.similarity,
  };
}

export async function getStockItemSuggestions(
  restaurantId: string,
  name: string,
) {
  const { data } = await api.get("/stock/suggestions", {
    params: {
      restaurantId,
      name,
    },
  });

  return data;
}
