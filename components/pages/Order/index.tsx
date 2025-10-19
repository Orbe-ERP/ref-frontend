import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getCategories } from "@/services/category";
import useRestaurant from "@/hooks/useRestaurant";
import CategoryList from "@/components/organisms/CategoryList";
import Button from "@/components/atoms/Button";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import * as S from "./styles";
import { useAppTheme } from "@/context/ThemeProvider/theme";

export default function OrderPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<any>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [addedProducts, setAddedProducts] = useState<any[]>([]);
  const theme = useAppTheme()
  const router = useRouter();
  const { tableId } = useLocalSearchParams();
  const { selectedRestaurant } = useRestaurant();

  useEffect(() => {
    const fetchCategories = async () => {
      if (selectedRestaurant) {
        const categoriesData = await getCategories(selectedRestaurant.id);
        setCategories(categoriesData);
      }
    };
    fetchCategories();
  }, [selectedRestaurant]);

  const toggleCategory = (id: string) => {
    setExpandedCategory((prev) => (prev === id ? null : id));
  };

  const handleProductChange = (catId: string, prodId: string, q: number) => {
    setSelectedProducts((prev: any) => ({
      ...prev,
      [catId]: { productId: prodId, quantity: q, productName: name },
    }));
  };

  const handleQuantityChange = (
    catId: string,
    prodId: string,
    delta: number
  ) => {
    const current =
      selectedProducts[catId]?.productId === prodId
        ? selectedProducts[catId].quantity
        : 0;
    const newQ = Math.max(1, current + delta);
    handleProductChange(catId, prodId, newQ);
  };

  const handleAddProduct = (id: string, name: string, q: number) => {
    setAddedProducts((prev) => [
      ...prev,
      { productId: id, productName: name, quantity: q },
    ]);
  };

  const goToCart = () => {
    router.push({
      pathname: "/cart",
      params: { tableId, addedProducts: JSON.stringify(addedProducts) },
    });
  };
  const goToClosedOrders = () => {
    router.push({
      pathname: "/(private)/closed-order",
      params: { tableId },
    });
  };

  const handleTablePress = () => {
    router.push({
      pathname: "/oppened-order",
      params: { tableId },
    });
  };

  return (
    <S.Container>
      <Stack.Screen
        options={{
          title: "Comanda",
          headerStyle: { backgroundColor: theme.theme.colors.background },
          headerTintColor: theme.theme.colors.text.primary,

          headerRight: () => (
            <S.HeaderRightContainer>
              <S.CartContainer onPress={goToClosedOrders}>
                <Ionicons name="print-outline" size={24} color="#2BAE66" />
              </S.CartContainer>

              <S.CartContainer onPress={goToCart}>
                <Ionicons name="cart-outline" size={24} color="#2BAE66" />
                {addedProducts.length > 0 && (
                  <S.Badge>
                    <S.BadgeText>{addedProducts.length}</S.BadgeText>
                  </S.Badge>
                )}
              </S.CartContainer>
            </S.HeaderRightContainer>
          ),
        }}
      />

      <CategoryList
        categories={categories}
        expandedCategory={expandedCategory}
        toggleCategory={toggleCategory}
        selectedProducts={selectedProducts}
        handleProductChange={handleProductChange}
        handleQuantityChange={handleQuantityChange}
        handleAddProduct={handleAddProduct}
      />

      <S.Footer>
        <Button
          label="Ver Comandas"
          variant="primary"
          onPress={handleTablePress}
        />
      </S.Footer>
    </S.Container>
  );
}
