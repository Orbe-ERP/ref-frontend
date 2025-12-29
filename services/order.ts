import { api } from "./api";
import { Kitchen } from "./kitchen";

export interface OrderProduct {
  customObservation: any;
  id: string;
  productId: string;
  quantity: number;
  appliedPrice?: number;
  status: string;
  
  observations?: { id: string; description: string }[];
  product: {
    name: string;
    price: number;
    compositions: any
    kitchen: Kitchen;
  };
}

export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: T[];
}

export interface Order {
  id: string;
  identifier: string;
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
  cardBrand?: string;
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
    customObservation?: string;
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
  productId: string;
  status: string;
}

export interface UpdatePaymentMethod {
  id: string;
  paymentMethod: string;
}

export interface ConcludeOrderInput {
  tableId: string;
  ordersArray: string[];
  restaurantId: string;
  sumIndividually?: boolean;
  additional?: number;
  paymentMethod: "CASH" | "PIX" | "CREDIT_CARD" | "DEBIT_CARD" | "OTHER";
  paymentConfigId?: string | null;
}

export interface ConcludeSingleOrderInput {
  orderId: string;
  restaurantId: string;
  additional?: number;
  paymentMethod: "CASH" | "PIX" | "CREDIT_CARD" | "DEBIT_CARD" | "OTHER";
  paymentConfigId?: string | null;
}

export interface ReportDataProduct {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface ReportData {
  id: string;
  identifier: string;
  restaurantId: string;
  totalValue: number;
  additional: number;
  paymentMethod: string;
  paymentConfigId?: string | null;

  operator?: string | null;
  responsibles?: string[];
  tableId?: string | null;
  tableName?: string | null;

  products: ReportDataProduct[];

  createdAt: string;
  updatedAt: string;
}

export async function getCompletedOrdersByTable(
  tableId: string,
  page = 1,
  limit = 10,
  startDate?: string,
  endDate?: string
) {
  if (!tableId) throw new Error("Table Id not defined");

  console.log("Fetching completed orders for table:", tableId, {
    page,
    limit,
    startDate,
    endDate,
  });

  try {
    const response = await api.get(`/orders/table/completed/${tableId}`, {
      params: {
        page,
        limit,
        startDate,
        endDate,
      },
    });

    console.log("Received response:", response.data);

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching completed orders: ${error}`);
  }
}


export async function createOrder(order: NewOrder) {
  if (!order) throw new Error("Dados faltantes");

  try {
    const response = await api.post("/orders", order);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error creating order: ${error}`);
  }
}

export async function getOrdersByRestaurant(
  restaurantId: string,
  status?: string
) {
  if (!restaurantId) throw new Error("Restaurant Id not defined");

  try {
    const response = await api.get(`/orders/restaurant/${restaurantId}`, {
      params: status ? { status } : {},
    });

    const orders = Array.isArray(response.data) ? response.data : [];

    const filteredOrders = orders
      .map((order: any) => {
        const filteredProducts =
          order.products?.filter(
            (product: any) => product.product?.kitchen?.showOnKitchen !== false
          ) || [];

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

export async function concludeOrders({
  tableId,
  restaurantId,
  paymentMethod,
  paymentConfigId,
  ordersArray,
  sumIndividually,
  additional = 0,
}: ConcludeOrderInput) {
  if (!tableId || !restaurantId)
    throw new Error("TableId e RestaurantId são obrigatórios");

  try {
    const response = await api.put(`/orders/restaurant/conclude-orders`, {
      tableId,
      restaurantId,
      paymentMethod,
      paymentConfigId: paymentConfigId || null,
      sumIndividually,
      additional,
      ordersArray,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error concluding orders: ${error}`);
  }
}

export async function concludeOrder({
  orderId,
  restaurantId,
  additional = 0,
  paymentMethod,
  paymentConfigId,
}: ConcludeSingleOrderInput) {
  if (!orderId || !restaurantId)
    throw new Error("OrderId e RestaurantId são obrigatórios");

  try {
    const response = await api.put(
      `/orders/${orderId}/restaurant/${restaurantId}/conclude`,
      {
        additional,
        paymentMethod,
        paymentConfigId,
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error concluding single order: ${error}`);
  }
}

export async function getOrderSummaryByIdentifier(
  identifier: string,
  sumIndividually: boolean = false
) {
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

export async function getCompletedOrdersByDateRange(
  restaurantId: string,
  page = 1,
  limit = 10,
  startDate?: string,
  endDate?: string
): Promise<PaginatedResponse<ReportData>> {
  if (!restaurantId) throw new Error("Restaurant Id not defined");

  try {
    const response = await api.get(`/orders/completed`, {
      params: {
        restaurantId,
        page,
        limit,
        startDate,
        endDate,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching completed orders by date range: ${error}`);
  }
}
