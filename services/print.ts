import { api } from "./api";

export async function printReceipt(
  identifier: string,
  printerId?: string
) {
  if (!identifier) {
    throw new Error("Identificador não definido");
  }

  try {
    const response = await api.get(
      `/print/receipt/${identifier}`,
      {
        params: printerId ? { printerId } : {},
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Erro ao imprimir recibo"
    );
  }
}
