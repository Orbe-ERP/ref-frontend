import { useEffect, useState } from "react";

type State = {
  [categoryId: string]: {
    [modifierId: string]: number;
  };
};


interface SelectedModifier {
  modifierId: string;
  quantity: number;
}


interface Modifier {
  id: string;
  name: string;
  priceChange: number;
}

interface ModifierCategory {
  id: string;
  name: string;
  required: boolean;
  min: number;
  max: number;
  modifiers: Modifier[];
}

interface Props {
  productId: string;
  categories: ModifierCategory[];
  onChange: (result: SelectedModifier[]) => void;
}

export function ProductModifiersSelector({
  categories,
  onChange,
}: Props) {
  const [state, setState] = useState<State>({});

  function updateModifier(
    categoryId: string,
    modifierId: string,
    delta: number,
    max: number
  ) {
    setState(prev => {
      const currentQty = prev[categoryId]?.[modifierId] ?? 0;
      const newQty = Math.max(0, Math.min(currentQty + delta, max));

      return {
        ...prev,
        [categoryId]: {
          ...prev[categoryId],
          [modifierId]: newQty,
        },
      };
    });
  }

  useEffect(() => {
    const result: SelectedModifier[] = [];

    Object.values(state).forEach(category =>
      Object.entries(category).forEach(([modifierId, quantity]) => {
        if (quantity > 0) {
          result.push({ modifierId, quantity });
        }
      })
    );

    onChange(result);
  }, [state]);

  return (
    <div>
      {categories.map(category => {
        const selectedCount = Object.values(
          state[category.id] || {}
        ).reduce((a, b) => a + b, 0);

        return (
          <div key={category.id}>
            <h3>
              {category.name}
              {category.required && " *"}
            </h3>

            {category.modifiers.map(mod => {
              const qty = state[category.id]?.[mod.id] ?? 0;
              const disabledAdd = selectedCount >= category.max;

              return (
                <div key={mod.id} style={{ display: "flex", gap: 8 }}>
                  <span>
                    {mod.name} (+{mod.priceChange})
                  </span>

                  <button
                    onClick={() =>
                      updateModifier(category.id, mod.id, -1, category.max)
                    }
                    disabled={qty === 0}
                  >
                    -
                  </button>

                  <span>{qty}</span>

                  <button
                    onClick={() =>
                      updateModifier(category.id, mod.id, 1, category.max)
                    }
                    disabled={disabledAdd}
                  >
                    +
                  </button>
                </div>
              );
            })}

            {category.required && selectedCount < category.min && (
              <p style={{ color: "red" }}>
                Selecione no mínimo {category.min}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
