import { api } from "./api";
import dayjs from "dayjs";

export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH' | 'PIX' | 'OTHER';
export interface ReportProduct {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface ReportData {
  id: string;
  restaurantId: string;
  totalValue: number;
  feePaidValue: number;
  additional: number;
  paymentMethod: PaymentMethod;
  month: string;
  products: ReportProduct[];
  createdAt: string;
  updatedAt: string;
}

export interface GetReportDataInput {
  restaurantId: string;
  initialDate: string;
  finalDate: string;
}


export interface TotalProductsSoldResponse {
  totalProductsSold: number;
  startDate: string;
  endDate: string;
}


export async function getTotalProductsSold(
  restaurantId: string,
  startDate: Date,
  endDate: Date
): Promise<TotalProductsSoldResponse> {
  try {
    const response = await api.get("/products/total", {
      params: {
        restaurantId,
        startDate: dayjs(startDate).toISOString(),
        endDate: dayjs(endDate).toISOString(),
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar total de produtos vendidos:", error);
    throw error;
  }
}



export async function getReportData({ restaurantId, initialDate, finalDate }: GetReportDataInput): Promise<ReportData> {
  if (!restaurantId || !initialDate || !finalDate) {
    throw new Error("Todos os parâmetros são obrigatórios");
  }

  console.log(initialDate, finalDate)

  try {
    const response = await api.get<ReportData>(`/reports/?restaurantId=${restaurantId}&initialDate=${initialDate}&finalDate=${finalDate}`, {
    });
    return response.data;
  } catch (error: any) {
    throw new Error(`Erro ao buscar relatório: ${error.message}`);
  }
}