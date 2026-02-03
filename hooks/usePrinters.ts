import { useCallback, useEffect, useState } from "react";
import {
  CreatePrinter,
  UpdatePrinter,
  getPrintersByRestaurant,
  createPrinter as createPrinterService,
  updatePrinter as updatePrinterService,
  deletePrinter as deletePrinterService,
  PrintAgentPublic,
  regenerateAgentKey,
} from "@/services/printer";
import useRestaurant from "@/hooks/useRestaurant";

export function usePrinters() {
  const { selectedRestaurant } = useRestaurant();

  const [printers, setPrinters] = useState<PrintAgentPublic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPrinters = useCallback(async () => {
    if (!selectedRestaurant?.id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getPrintersByRestaurant(selectedRestaurant.id);
      setPrinters(data);
    } catch (err) {
      setError("Erro ao carregar impressoras");
    } finally {
      setLoading(false);
    }
  }, [selectedRestaurant?.id]);

  useEffect(() => {
    loadPrinters();
  }, [loadPrinters]);

  async function createPrinter(data: Omit<CreatePrinter, "restaurantId">) {
    if (!selectedRestaurant?.id) {
      throw new Error("Nenhum restaurante selecionado");
    }

    const created = await createPrinterService({
      ...data,
      restaurantId: selectedRestaurant.id,
    });

    await loadPrinters();

    return created
  }

  async function updatePrinter(
    printerId: string,
    data: UpdatePrinter
  ) {
    await updatePrinterService(printerId, data);
    

    await loadPrinters();
  }

  async function deletePrinter(printerId: string) {
    await deletePrinterService(printerId);
    await loadPrinters();
  }

    async function regenerateAgent(id: string) {
    const res = await regenerateAgentKey(id);
    setPrinters(prev =>
      prev.map(p => (p.id === id ? { ...p, agentKey: res.agentKey } : p))
    );

    return res;
  }

  return {
    printers,
    loading,
    error,
    reload: loadPrinters,
    createPrinter,
    updatePrinter,
    deletePrinter,
    regenerateAgent,
  };
}
