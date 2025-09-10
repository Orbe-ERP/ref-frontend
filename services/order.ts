import { api } from "./api";

export interface Order {
  id: string;
  tableId: string;
  products: {
    productId: string;
    quantity: number;
    observation: string;
    product: {
      name: string;
      price: number;
      kitchen: string;
    };
  }[];
  table: {
    name: string;
  };
  responsible: string;
  toTake: boolean;
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  additional: number;
}

type NewOrder = {
  tableId: string;
  responsible: string;
  toTake: Boolean;
  products: {
    observation: string;
    productId: string;
    quantity: number;
  }[];
};

export interface AddProductInput {
  orderId: string;
  productId: string;
  quantity: number;
  observation: string;
}

export interface UpdateOrderStatus {
  id: string;
  status: string;
}

export interface UpdatePaymentMethod {
  id: string;
  paymentMethod: string;
}

export async function createOrder(order: NewOrder) {

  console.log(order)

  if (!order) {
    throw new Error("Dados faltantes");
  }
  try {
    const response = await api.post("/orders", order);
    return response.data;
  } catch (error) {
    console.log(error)
    throw new Error(`Error: ${error}`);
  }
}

export async function getOrdersByRestaurant(
  restaurantId: string,
  steps?: string
) {
  if (!restaurantId) {
    throw new Error("Restaurant Id not defined");
  }

  try {
    const response = await api.get(`orders/restaurant/${restaurantId}`, {
      params: steps ? { status: steps } : {},
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

export async function getOrders(tableId: string) {
  if (!tableId) {
    throw new Error("Id not defined");
  }
  try {
    const response = await api.get(`/orders/table/${tableId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

export async function addProductToOrder(productData: AddProductInput) {
  try {
    const response = await api.post("/orders/add-product", productData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(`Error adding product to order: ${error}`);
  }
}

export async function updateStatus(orderData: UpdateOrderStatus) {
  try {
    const response = await api.patch("/orders", orderData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(`Error updating order: ${error}`);
  }
}

export async function getOrderById(orderId: string) {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching order: ${error}`);
  }
}

export async function updatePaymentMethod(i: UpdatePaymentMethod) {
  try {
    const response = await api.patch("/orders", i);

    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(`Error fetching order: ${error}`);
  }
}

export async function concludeOrders(tableId: string, sumInvidually: boolean, restaurantId: string, additional:number = 0) {
  try {
    const response = await api.put(
      `orders/restaurant/${restaurantId}/table/${tableId}/conclude?sumIndividually=${sumInvidually}&additional=${additional}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(`Error fetching order: ${error}`);
  }
}

export async function getOrderSummaryByIdentifier(identifier: string, sumIndividually: boolean = false){
  if (!identifier) {
    throw new Error("Identifier is required");
  }

  try {
    const response = await api.get(`${identifier}/summary`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order summary:", error);   
    throw new Error(`Failed to get order summary: ${error}`);
  }
}