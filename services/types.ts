export interface ProductSales {
  productId: string;
  productName: string;
  salesCount: number;
  totalRevenue: number;
  category?: string;
}

export interface SalesTimeRange {
  day: ProductSales[];
  week: ProductSales[];
  month: ProductSales[];
}

export interface TimeRangeFilter {
  label: string;
  value: keyof SalesTimeRange;
}

export type ChartType = 'bar' | 'pie';