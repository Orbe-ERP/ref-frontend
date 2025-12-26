import { api } from "./api";

export interface Printer {
  id: string;
  restaurantId: string;
  name: string;
  ip: string;
  port: number;
  default?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrinter {
  name: string;
  ip: string;
  port: number;
  default?: boolean;
  restaurantId: string;
}

export interface UpdatePrinter {
  name?: string;
  ip?: string;
  port?: number;
  default?: boolean;
}

export async function getPrintersByRestaurant(
  restaurantId: string | undefined
) {
  if (!restaurantId) {
    throw new Error("Nenhum restaurante selecionado");
  }

  try {
    const response = await api.get<Printer[]>(
      `/printers/restaurant/${restaurantId}`
    );

    return response.data;
  } catch (error) {
    throw new Error(`Erro ao obter impressoras: ${error}`);
  }
}

export async function getPrinterById(printerId: string | undefined) {
  if (!printerId) {
    throw new Error("ID da impressora não definido");
  }

  try {
    const response = await api.get<Printer>(`/printers/${printerId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao obter impressora: ${error}`);
  }
}

export async function createPrinter(body: CreatePrinter) {
  if (!body.restaurantId) {
    throw new Error("ID do restaurante não definido");
  }

  try {
    const response = await api.post<Printer>("/printers", body);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao criar impressora: ${error}`);
  }
}

export async function updatePrinter(
  printerId: string | undefined,
  body: UpdatePrinter
) {
  if (!printerId) {
    throw new Error("ID da impressora não definido");
  }

  try {
    const response = await api.patch<Printer>(
      `/printers/${printerId}`,
      body
    );
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao atualizar impressora: ${error}`);
  }
}

export async function deletePrinter(printerId: string | undefined) {
  if (!printerId) {
    throw new Error("ID da impressora não definido");
  }

  try {
    const response = await api.delete<Printer>(`/printers/${printerId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao deletar impressora: ${error}`);
  }
}
