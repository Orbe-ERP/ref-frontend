import { api } from "./api";
import { Kitchen } from "./kitchen";

export interface OrderProduct {
  id: string
  productId: string;
  quantity: number;
  appliedPrice?: number;
  observations?: { id: string; description: string }[];
  product: {
    name: string;
    price: number;
    kitchen: Kitchen;
  };
}

export interface Order {
  id: string;
  tableId: string;
  quantity: number;
  products: OrderProduct[];
  table: { name: string };
  responsible: string;
  toTake: boolean;
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  additional?: number;
}

export type NewOrder = {
  tableId: string;
  responsible?: string;
  toTake: boolean;
  products: {
    productId: string;
    quantity: number;
    appliedPrice?: number;
    observations?: string[]; 
  }[];
};

export interface AddProductInput {
  orderId: string;
  productId: string;
  quantity: number;
  appliedPrice?: number;
  observations?: string[];
}

export interface UpdateOrderStatus {
  id: string;
  productId: string
  status: string;
}

export interface UpdatePaymentMethod {
  id: string;
  paymentMethod: string;
}

export async function createOrder(order: NewOrder) {


  console.log(order)
  if (!order) throw new Error("Dados faltantes");
  try {
    const response = await api.post("/orders", order);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error creating order: ${error}`);
  }
}

export async function getOrdersByRestaurant(restaurantId: string, status?: string) {
  if (!restaurantId) throw new Error("Restaurant Id not defined");

  try {
    const response = await api.get(`/orders/restaurant/${restaurantId}`, {
      params: status ? { status } : {},
    });

    const orders = response.data;

    const filteredOrders = orders
      .map((order: any) => {
        const filteredProducts = order.products.filter(
          (product: any) => product.product?.kitchen?.showOnKitchen !== false
        );

        return {
          ...order,
          products: filteredProducts,
        };
      })
      .filter((order: any) => order.products.length > 0);

    return filteredOrders;
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching orders by restaurant: ${error}`);
  }
}



export async function concludeOrder(orderId: string, additional: number = 0, restaurantId: string) {
  try {
    const response = await api.put(`/orders/${orderId}/restaurant/${restaurantId}/conclude`, null, {
      params: { additional },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error concluding single order: ${error}`);
  }
}


export async function getOrders(tableId: string) {
  if (!tableId) throw new Error("Table Id not defined");
  try {
    const response = await api.get(`/orders/table/${tableId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching orders by table: ${error}`);
  }
}

export async function addProductToOrder(productData: AddProductInput) {
  try {
    const response = await api.post("/orders/add-product", productData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error adding product to order: ${error}`);
  }
}

export async function getCompletedOrdersByTable(tableId: string) {
  if (!tableId) throw new Error("Table Id not defined");

  try {
    const response = await api.get(`/orders/completed`, {
      params: { tableId },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching completed orders: ${error}`);
  }
}


export async function updateStatus(orderData: UpdateOrderStatus) {
  try {
    const response = await api.patch("/orders", orderData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error updating order: ${error}`);
  }
}



export async function getOrderById(orderId: string) {
  if (!orderId) throw new Error("Order Id not defined");
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching order: ${error}`);
  }
}

export async function updatePaymentMethod(data: UpdatePaymentMethod) {
  try {
    const response = await api.patch("/orders", data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error updating payment method: ${error}`);
  }
}

export async function concludeOrders(
  tableId: string,
  sumIndividually: boolean,
  restaurantId: string,
  additional: number = 0
) {


  try {
    const response = await api.put(
      `/orders/restaurant/${restaurantId}/table/${tableId}/conclude`,
      null,
      {
        params: { sumIndividually, additional },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error concluding orders: ${error}`);
  }
}

export async function getOrderSummaryByIdentifier(identifier: string, sumIndividually: boolean = false) {
  if (!identifier) throw new Error("Identifier is required");
  try {
    const response = await api.get(`/orders/${identifier}/summary`, {
      params: { sumIndividually },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to get order summary: ${error}`);
  }
}
