import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import Title from "@/components/atoms/Title";
import Button from "@/components/atoms/Button";
interface StockSuggestion {
  id: string;
  name: string;
  similarity: number;
}
import styled from "styled-components/native";
import { getStockItemSuggestions } from "@/services/purchase";
import useRestaurant from "@/hooks/useRestaurant";
import { usePurchaseImport } from "@/context/PurchaseImportProvider";

export const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const ItemName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const SuggestionCard = styled.View`
  padding: 16px;
  margin-top: 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.overlay};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const SuggestionName = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Similarity = styled.Text`
  font-size: 13px;
  margin: 4px 0 12px 0;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export default function MatchStockItemScreen() {
  const { itemName, itemIndex, restaurantId } = useLocalSearchParams<{
    itemName: string;
    itemIndex: string;
    restaurantId: string;
  }>();
  const { resolveItem } = usePurchaseImport();

  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([]);

  useEffect(() => {
    async function loadSuggestions() {
      try {
        const response = await getStockItemSuggestions(restaurantId, itemName);
        setSuggestions(response);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: "Não foi possível buscar sugestões",
        });
      } finally {
        setLoading(false);
      }
    }

    loadSuggestions();
  }, [itemName]);

  function handleSelect(stockItemId: string) {
    resolveItem(Number(itemIndex), stockItemId);
    router.back();
  }

  return (
    <>
      <Stack.Screen options={{ title: "Corrigir item" }} />

      <Container>
        <Title>Item da Nota</Title>
        <ItemName>{itemName}</ItemName>

        <Title style={{ marginTop: 16 }}>Sugestões</Title>

        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          refreshing={loading}
          renderItem={({ item }) => (
            <SuggestionCard>
              <SuggestionName>{item.name}</SuggestionName>
              <Similarity>
                Similaridade {(item.similarity * 100).toFixed(0)}%
              </Similarity>

              <Button
                label="Selecionar"
                onPress={() => handleSelect(item.id)}
              />
            </SuggestionCard>
          )}
        />

        <Button
          label="Cancelar"
          variant="secondary"
          onPress={() => router.back()}
        />
      </Container>
    </>
  );
}
