import React, { useEffect, useState } from "react";
import { FlatList, Alert, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";

import * as S from "./styles";
import Button from "@/components/atoms/Button";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import useRestaurant from "@/hooks/useRestaurant";
import useAuth from "@/hooks/useAuth";
import { getStockItems, deleteStockItem, StockItem } from "@/services/stock";

type StockStatus = "ok" | "warning" | "critical";

export default function StockItems() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { selectedRestaurant } = useRestaurant();
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  const [items, setItems] = useState<StockItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  async function loadStock() {
    if (!selectedRestaurant?.id) return;

    try {
      const data = await getStockItems(selectedRestaurant.id);
      setItems(data);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar o estoque");
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadStock();
  }, [selectedRestaurant]);

  async function onRefresh() {
    setRefreshing(true);
    await loadStock();
  }

  function handleDelete(id: string) {
    Alert.alert(
      "Excluir item",
      "Tem certeza que deseja excluir este item do estoque?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteStockItem(id);
              loadStock();
            } catch {
              Alert.alert("Erro", "Erro ao excluir item");
            }
          },
        },
      ]
    );
  }

  function getStatus(item: StockItem): StockStatus {
    if (!item.minimum) return "ok";
    if (item.quantity <= item.minimum) return "critical";
    if (item.quantity <= item.minimum * 1.2) return "warning";
    return "ok";
  }

  function renderItem({ item }: { item: StockItem }) {
    const status = getStatus(item);

    return (
      <S.StockCard status={status}>
        <S.InfoContainer>
          <S.StockName>{item.name}</S.StockName>

          <S.StockInfo>
            {item.quantity} {item.unit ?? ""}
          </S.StockInfo>

          {item.minimum !== undefined && (
            <S.StockMinimum>
              Mínimo: {item.minimum}
            </S.StockMinimum>
          )}
        </S.InfoContainer>

        {isAdmin && (
          <S.Actions>
            <S.ActionButton
              onPress={() =>
                router.push({
                  pathname: "/(private)/stock/items/adjust",
                  params: { stockItemId: item.id },
                })
              }
            >
              <Ionicons
                name="swap-vertical-outline"
                size={20}
                color={theme.colors.primary}
              />
            </S.ActionButton>

            <S.ActionButton onPress={() => handleDelete(item.id)}>
              <Ionicons
                name="trash-outline"
                size={20}
                color={theme.colors.feedback.error}
              />
            </S.ActionButton>
          </S.Actions>
        )}
      </S.StockCard>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Estoque",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />

      <S.ScreenContainer>
        {isAdmin && (
          <S.Header>
            <Button
              label="Novo Item"
              icon={<Ionicons name="add" size={18} color="#fff" />}
              onPress={() =>
                router.push("/stock/items/create-stock")
              }
            />
          </S.Header>
        )}

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          contentContainerStyle={
            items.length === 0 ? { flex: 1 } : undefined
          }
          ListEmptyComponent={
            <S.EmptyContainer>
              <Ionicons
                name="cube-outline"
                size={48}
                color="#999"
              />
              <S.EmptyText>
                Nenhum item no estoque
              </S.EmptyText>
            </S.EmptyContainer>
          }
        />
      </S.ScreenContainer>
    </>
  );
}
