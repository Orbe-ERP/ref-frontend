import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  RefreshControl,
  ActivityIndicator,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";

import * as S from "./styles";
import Button from "@/components/atoms/Button";
import { Pagination } from "@/components/organisms/Pagination";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import useRestaurant from "@/hooks/useRestaurant";
import useAuth from "@/hooks/useAuth";
import { getStockItems, deleteStockItem, StockItem } from "@/services/stock";
import Toast from "react-native-toast-message";

type StockStatus = "ok" | "warning" | "critical";

export default function StockItems() {
  const router = useRouter();
  const { refresh } = useLocalSearchParams();
  const { theme } = useAppTheme();
  const { selectedRestaurant } = useRestaurant();
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  const [items, setItems] = useState<StockItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 20;

  const loadStock = useCallback(
    async (page = 1, isRefreshing = false) => {
      if (!selectedRestaurant?.id) return;

      try {
        if (page === 1) {
          if (isRefreshing) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }
        } else {
          setLoadingMore(true);
        }

        const response = await getStockItems(
          selectedRestaurant.id,
          page,
          limit
        );

        let itemsData: StockItem[] = [];
        let totalPagesData = 1;
        let totalItemsData = 0;

        if (Array.isArray(response)) {
          itemsData = response;
          totalItemsData = response.length;
          totalPagesData = Math.ceil(response.length / limit);
        } else if (response && typeof response === "object") {
          itemsData = response.items || response.data || [];
          totalItemsData = response.total || response.count || itemsData.length;
          totalPagesData =
            response.totalPages ||
            response.pages ||
            Math.ceil(totalItemsData / limit);
        } else {
        }

        setItems(itemsData);
        setCurrentPage(page);
        setTotalPages(totalPagesData);
        setTotalItems(totalItemsData);
      } catch (error: any) {
        Toast.show({
          type: "error",
          text1: "Erro interno",
          text2: "Erro ao carregar estoque",
          position: "top",
          visibilityTime: 3000,
        });

        if (page === 1) {
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [selectedRestaurant?.id]
  );

  useEffect(() => {

    loadStock(1);
  }, [selectedRestaurant?.id, refresh]);

  const onRefresh = useCallback(() => {
    loadStock(1, true);
  }, [loadStock]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      loadStock(currentPage - 1);
    }
  }, [currentPage, loadStock]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      loadStock(currentPage + 1);
    }
  }, [currentPage, totalPages, loadStock]);

async function handleDelete(id: string) {
  const itemToDelete = items.find((item) => item.id === id);

  if (!itemToDelete) {
    Toast.show({
      type: "error",
      text1: "Item não encontrado",
      position: "top",
      visibilityTime: 3000,
    });
    return;
  }

  try {
    await deleteStockItem(id);

    setItems((prev) => prev.filter((item) => item.id !== id));
    setTotalItems((prev) => Math.max(prev - 1, 0));

    Toast.show({
      type: "success",
      text1: "Item removido",
      text2: `${itemToDelete.name} foi excluído do estoque`,
      position: "top",
      visibilityTime: 3000,
    });
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Erro ao remover item",
      text2: "Tente novamente",
      position: "top",
      visibilityTime: 3000,
    });
  }
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
      <S.StockRow status={status}>
        <S.ColumnName numberOfLines={1}>{item.name}</S.ColumnName>

        <S.ColumnQty>
          {item.quantity} {item.unit ?? ""}
        </S.ColumnQty>

        <S.ColumnMin>
          {item.minimum !== undefined ? `Min: ${item.minimum}` : "-"}
        </S.ColumnMin>

        {isAdmin && (
          <S.RowActions>
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
                size={18}
                color={theme.colors.primary}
              />
            </S.ActionButton>

            <S.ActionButton
              onPress={() =>
                router.push({
                  pathname: "/(private)/stock/items/create-stock",
                  params: { id: item.id },
                })
              }
            >
              <Ionicons
                name="create-outline"
                size={18}
                color={theme.colors.primary}
              />
            </S.ActionButton>

            <S.ActionButton onPress={() => handleDelete(item.id)}>
              <Ionicons
                name="trash-outline"
                size={18}
                color={theme.colors.feedback.error}
              />
            </S.ActionButton>
          </S.RowActions>
        )}
      </S.StockRow>
    );
  }

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  const renderHeader = () => {
    if (loading && !refreshing) {
      return (
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }
    return null;
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: `Estoque ${totalItems > 0 ? `(${totalItems})` : ""}`,
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />

      <S.ScreenContainer style={{ flex: 1 }}>
        {isAdmin && (
          <S.Header>
            <Button
              label="Novo Item"
              icon={<Ionicons name="add" size={18} color="#fff" />}
              onPress={() => router.push("/(private)/stock/items/create-stock")}
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
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            !loading && !refreshing ? (
              <S.EmptyContainer>
                <Ionicons name="cube-outline" size={48} color="#999" />
                <S.EmptyText>Nenhum item no estoque</S.EmptyText>
                {isAdmin && (
                  <Button
                    label="Adicionar Primeiro Item"
                    onPress={() =>
                      router.push("/(private)/stock/items/create-stock")
                    }
                  />
                )}
              </S.EmptyContainer>
            ) : null
          }
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20,
          }}
          style={{ flex: 1 }}
        />

        {totalPages > 1 && items.length > 0 && (
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: theme.colors.border,
              backgroundColor: theme.colors.background,
            }}
          >
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPrev={handlePrevPage}
              onNext={handleNextPage}
              isLoading={loading || loadingMore}
            />
          </View>
        )}
      </S.ScreenContainer>
    </>
  );
}
