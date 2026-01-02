import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import useRestaurant from "@/hooks/useRestaurant";
import { getModifierCategories } from "@/services/modifierCategory";
import { Modifier } from "@/services/modifier";
import styled from "styled-components/native";

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;

  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.08;
  shadow-radius: 4px;
  elevation: 2;
`;

export const ItemName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`;

export const ItemInfo = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-top: 80px;
`;

export const EmptyText = styled.Text`
  margin-top: 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;


export default function ModifiersByCategoryPage() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { theme } = useAppTheme();
  const { selectedRestaurant } = useRestaurant();

  const [modifiers, setModifiers] = useState<Modifier[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadModifiers() {
    if (!selectedRestaurant?.id || !categoryId) return;

    try {
      setLoading(true);

      const categories = await getModifierCategories(selectedRestaurant.id);
      const category = categories.find(c => c.id === categoryId);

      setModifiers(category?.modifiers ?? []);
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
    loadModifiers();
  }, [categoryId]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Modificadores",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />

      <FlatList
        data={modifiers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          !loading && (
            <EmptyContainer>
              <Ionicons
                name="options-outline"
                size={48}
                color={theme.colors.text.secondary}
              />
              <EmptyText>
                Nenhum modificador nessa categoria
              </EmptyText>
            </EmptyContainer>
          )
        }
        renderItem={({ item }) => (
          <Card>
            <ItemName>{item.name}</ItemName>
            <ItemInfo>
              Tipo: {item.type === "ADD" ? "Adicionar" : "Remover"}
            </ItemInfo>
            <ItemInfo>
              Preço: {item.priceChange.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </ItemInfo>
          </Card>
        )}
      />
    </>
  );
}
