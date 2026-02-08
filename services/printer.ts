import { api } from "./api";

export interface PrintAgentType {
  RECEIPT: "RECEIPT";
  KITCHEN: "KITCHEN";
  BAR: "BAR";
  OTHER: "OTHER";
}
export interface PrintAgentPublic {
  id: string;
  name: string;
  type: PrintAgentType;
  restaurantId: string;
  active: boolean;
  isDefault: boolean;
  createdAt: Date;
}

export interface PrintAgentCreatedResponse {
  id: string;
  name: string;
  type: PrintAgentType;
  restaurantId: string;
  agentKey: string;
  createdAt: Date;
}

export interface CreatePrinter {
  name: string;
  default?: boolean;
  restaurantId: string;
  type: PrintAgentType;
}

export interface UpdatePrinter {
  name?: string;
  id: string;
  default?: boolean;
  type: PrintAgentType;
}

export async function getPrintersByRestaurant(
  restaurantId: string | undefined,
) {
  if (!restaurantId) {
    throw new Error("Nenhum restaurante selecionado");
  }

  try {
    const response = await api.get<PrintAgentPublic[]>(
      `/print-agent/restaurant/${restaurantId}`,
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
    const response = await api.get<PrintAgentPublic>(
      `/print-agent/${printerId}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao obter impressora: ${error}`);
  }
}

export async function createPrinter(
  body: CreatePrinter,
): Promise<PrintAgentCreatedResponse> {
  if (!body.restaurantId) {
    throw new Error("ID do restaurante não definido");
  }

  try {
    const response = await api.post<PrintAgentCreatedResponse>(
      "/print-agent",
      body,
    );
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao criar impressora: ${error}`);
  }
}

export async function regenerateAgentKey(id: string | undefined) {
  if (!id) {
    throw new Error("ID não definido");
  }

  try {
    const response = await api.post<PrintAgentCreatedResponse>(
      `print-agent/${id}/regenerate-key`,
    );
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao criar impressora: ${error}`);
  }
}

export async function updatePrinter(
  printerId: string | undefined,
  body: UpdatePrinter,
) {
  if (!printerId) {
    throw new Error("ID da impressora não definido");
  }

  try {
    const response = await api.patch<PrintAgentPublic>(
      `/print-agent/${printerId}`,
      body,
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
    const response = await api.delete<PrintAgentPublic>(
      `/print-agent/${printerId}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao deletar impressora: ${error}`);
  }
}
