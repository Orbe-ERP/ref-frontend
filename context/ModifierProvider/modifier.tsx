import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { getModifiersByProductIds } from "@/services/modifier";
import { getModifierCategories, ModifierCategory } from "@/services/modifierCategory";

export function useProductModifiers(
  productId: string,
  restaurantId: string
) {
  const [categories, setCategories] = useState<ModifierCategory[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);

      const [modifiers, allCategories] = await Promise.all([
        getModifiersByProductIds([productId]),
        getModifierCategories(restaurantId),
      ]);

      const categoriesWithModifiers = allCategories
        .map(category => ({
          ...category,
          modifiers: modifiers.filter(
            (m: any) => m.categoryId === category.id
          ),
        }))
        .filter(category => category.modifiers?.length);

      setCategories(categoriesWithModifiers);
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível carregar os modificadores",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (productId && restaurantId) load();
  }, [productId, restaurantId]);

  return { categories, loading };
}
