import { api } from "./api";
import dayjs from "dayjs";
import { Order } from "./order";
import { ProductSales, SalesTimeRange } from "./types";
export class SalesService {
  static processProductSales(orders: Order[]): ProductSales[] {
    const productSalesMap = new Map<string, ProductSales>();

    orders.forEach((order) => {
      order.products.forEach((orderProduct) => {
        if (!orderProduct.product) return; 

        const productId = orderProduct.product.id;
        const productName = orderProduct.product.name;
        const price = orderProduct.appliedPrice ?? orderProduct.product.price;

        const existing = productSalesMap.get(productId);

        if (existing) {
          existing.salesCount += orderProduct.quantity;
          existing.totalRevenue += price * orderProduct.quantity;
        } else {
          productSalesMap.set(productId, {
            productId,
            productName,
            salesCount: orderProduct.quantity,
            totalRevenue: price * orderProduct.quantity,
          });
        }
      });
    });

    return Array.from(productSalesMap.values());
  }
  static filterByTimeRange(orders: Order[], startDate: Date, endDate: Date): Order[] {
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });
  }

  static getSalesByTimeRange(orders: Order[]): SalesTimeRange {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return {
      day: this.processProductSales(this.filterByTimeRange(orders, startOfDay, endOfDay)),
      week: this.processProductSales(this.filterByTimeRange(orders, startOfWeek, endOfWeek)),
      month: this.processProductSales(this.filterByTimeRange(orders, startOfMonth, endOfMonth)),
    };
  }

  // static getSalesByTimeRange(orders: Order[]): SalesTimeRange {
  //   const now = new Date();

  //   const startOfDay = new Date(now);
  //   startOfDay.setHours(0, 0, 0, 0);

  //   const startOfWeek = new Date(now);
  //   startOfWeek.setDate(now.getDate() - now.getDay());
  //   startOfWeek.setHours(0, 0, 0, 0);

  //   const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  //   return {
  //     day: this.processProductSales(this.filterByTimeRange(orders, startOfDay, now)),
  //     week: this.processProductSales(this.filterByTimeRange(orders, startOfWeek, now)),
  //     month: this.processProductSales(this.filterByTimeRange(orders, startOfMonth, now)),
  //   };
  // }

  static getTimeRanges() {
    return [
      { label: "Hoje", value: "day" as const },
      { label: "Semana", value: "week" as const },
      { label: "Mês", value: "month" as const },
    ];
  }

  static async getTotalProductsSold(
    restaurantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{ totalProductsSold: number }> {
    try {
      const response = await api.get("/reports/products/total", {
        params: {
          restaurantId,
          startDate: dayjs(startDate).toISOString(),
          endDate: dayjs(endDate).toISOString(),
        },
      });

      return response.data;
    } catch (error) {
      console.error("Erro ao buscar total de produtos vendidos:", error);
      throw new Error("Falha ao buscar total de produtos vendidos");
    }
  }
}
