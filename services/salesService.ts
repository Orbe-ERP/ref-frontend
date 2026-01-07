import dayjs from "dayjs";
import {
  ReportData,
  PaymentMethod,
} from "@/services/report";

export interface DashboardProductSales {
  productId: string;
  productName: string;
  salesCount: number;
  totalRevenue: number;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalProductsSold: number;
  averageTicket: number;
}

export interface PaymentMethodMetrics {
  method: PaymentMethod;
  totalValue: number;
  percentage: number;
}

export function filterReportsByDate(
  reports: ReportData[],
  startDate: Date,
  endDate: Date
): ReportData[] {
  return reports.filter((report) => {
    const createdAt = new Date(report.createdAt);
    return createdAt >= startDate && createdAt <= endDate;
  });
}

export function buildDashboardMetrics(
  reports: ReportData[]
): DashboardMetrics {
  const totalOrders = reports.length;

  const totalRevenue = reports.reduce(
    (sum, report) => sum + report.totalValue,
    0
  );

  const totalProductsSold = reports.reduce((sum, report) => {
    return (
      sum +
      report.products.reduce(
        (productSum, product) => productSum + product.quantity,
        0
      )
    );
  }, 0);

  const averageTicket =
    totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    totalRevenue,
    totalOrders,
    totalProductsSold,
    averageTicket,
  };
}

export function buildProductSales(
  reports: ReportData[]
): DashboardProductSales[] {
  const productMap = new Map<string, DashboardProductSales>();

  reports.forEach((report) => {
    report.products.forEach((product) => {
      const existing = productMap.get(product.productId);

      const revenue = product.quantity * product.price;

      if (existing) {
        existing.salesCount += product.quantity;
        existing.totalRevenue += revenue;
      } else {
        productMap.set(product.productId, {
          productId: product.productId,
          productName: product.productName,
          salesCount: product.quantity,
          totalRevenue: revenue,
        });
      }
    });
  });

  return Array.from(productMap.values()).sort(
    (a, b) => b.salesCount - a.salesCount
  );
}

export function buildPaymentMethodMetrics(
  reports: ReportData[]
): PaymentMethodMetrics[] {
  const map = new Map<PaymentMethod, number>();

  reports.forEach((report) => {
    map.set(
      report.paymentMethod,
      (map.get(report.paymentMethod) || 0) + report.totalValue
    );
  });

  const total = Array.from(map.values()).reduce(
    (sum, value) => sum + value,
    0
  );

  return Array.from(map.entries()).map(([method, totalValue]) => ({
    method,
    totalValue,
    percentage: total > 0 ? (totalValue / total) * 100 : 0,
  }));
}

export interface DailySalesItem {
  date: string;
  totalValue: number;
}

export function buildDailySalesChart(
  reports: ReportData[]
): DailySalesItem[] {
  const map = new Map<string, number>();

  reports.forEach((report) => {
    const date = dayjs(report.createdAt).format("YYYY-MM-DD");

    map.set(date, (map.get(date) || 0) + report.totalValue);
  });

  return Array.from(map.entries())
    .map(([date, totalValue]) => ({
      date,
      totalValue,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getTodayProductSales(
  reports: ReportData[] = []
): DashboardProductSales[] {
  const startOfDay = dayjs().startOf("day").toDate();
  const endOfDay = dayjs().endOf("day").toDate();

  const todayReports = filterReportsByDate(
    reports,
    startOfDay,
    endOfDay
  );

  return buildProductSales(todayReports);
}
