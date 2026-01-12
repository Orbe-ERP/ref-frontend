import React, { createContext, useContext, useState } from "react";

export interface PreviewItem {
  stockItemId?: string;
  name: string;
  quantity: number;
  unit: string;
  unitCost: number;
  confidence: number;
  needsAttention: boolean;
}

interface PurchaseImportContextData {
  items: PreviewItem[];
  setItems: React.Dispatch<React.SetStateAction<PreviewItem[]>>;
  resolveItem: (index: number, stockItemId: string) => void;
  unresolveItem: (index: number) => void;
  updateItem: (index: number, updated: Partial<PreviewItem>) => void;
  reset: () => void;
}

const PurchaseImportContext = createContext<PurchaseImportContextData | null>(
  null
);

export function PurchaseImportProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<PreviewItem[]>([]);

  function resolveItem(index: number, stockItemId: string) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              stockItemId,
              confidence: 1,
              needsAttention: false,
            }
          : item
      )
    );
    console.log(items);
  }

  function updateItem(index: number, updated: Partial<PreviewItem>) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updated } : item))
    );
  }

  function reset() {
    setItems([]);
  }

  function unresolveItem(index: number) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              stockItemId: undefined,
              confidence: 0,
              needsAttention: true,
            }
          : item
      )
    );
  }

  return (
    <PurchaseImportContext.Provider
      value={{ items, setItems, resolveItem, unresolveItem, reset, updateItem }}
    >
      {children}
    </PurchaseImportContext.Provider>
  );
}

export function usePurchaseImport() {
  const ctx = useContext(PurchaseImportContext);
  if (!ctx) {
    throw new Error(
      "usePurchaseImport deve ser usado dentro do PurchaseImportProvider"
    );
  }
  return ctx;
}
