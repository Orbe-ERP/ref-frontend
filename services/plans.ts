import { api } from "./api";


export interface Plan {
  id: string;       
  productId: string;
  name: 'starter' | 'pro' | 'enterprise';
  amount: number;      // centavos
  currency: string;
  interval: 'month' | 'year';
}

export async function getPlans() {
  try {
    const response = await api.get<[]>(`/plans/`);
    return response.data;
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}
