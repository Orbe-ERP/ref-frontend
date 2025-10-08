import { Order } from './order';
import { ProductSales, SalesTimeRange } from './types';

export class SalesService {
  static processProductSales(orders: Order[]): ProductSales[] {
    const productSalesMap = new Map<string, ProductSales>();

    orders.forEach(order => {
      order.products.forEach((orderProduct: any) => {
        const existing = productSalesMap.get(orderProduct.productId);
        
        if (existing) {
          existing.salesCount += orderProduct.quantity;
          existing.totalRevenue += (orderProduct.appliedPrice || orderProduct.product.price) * orderProduct.quantity;
        } else {
          productSalesMap.set(orderProduct.productId, {
            productId: orderProduct.productId,
            productName: orderProduct.product.name,
            salesCount: orderProduct.quantity,
            totalRevenue: (orderProduct.appliedPrice || orderProduct.product.price) * orderProduct.quantity,
          });
        }
      });
    });

    return Array.from(productSalesMap.values());
  }

  static filterByTimeRange(
    orders: Order[], 
    startDate: Date, 
    endDate: Date
  ): Order[] {
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });
  }

  static getSalesByTimeRange(orders: Order[]): SalesTimeRange {
    const now = new Date();
    
    // Dia atual
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const daySales = this.processProductSales(
      this.filterByTimeRange(orders, startOfDay, now)
    );

    // Semana atual
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const weekSales = this.processProductSales(
      this.filterByTimeRange(orders, startOfWeek, now)
    );

    // Mês atual
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthSales = this.processProductSales(
      this.filterByTimeRange(orders, startOfMonth, now)
    );

    return {
      day: daySales,
      week: weekSales,
      month: monthSales
    };
  }

  static getTimeRanges() {
    return [
      { label: 'Hoje', value: 'day' as const },
      { label: 'Semana', value: 'week' as const },
      { label: 'Mês', value: 'month' as const },
    ];
  }
}