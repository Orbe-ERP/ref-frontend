import React, { useEffect, useState, useCallback } from "react";
import { 
  FlatList, 
  Alert, 
  RefreshControl, 
  ActivityIndicator,
  View 
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
  
  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 20; // Itens por página

  const loadStock = useCallback(async (page = 1, isRefreshing = false) => {
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

      console.log(`📦 Carregando página ${page}...`);
      
      // Chama o service com paginação
      const response = await getStockItems(selectedRestaurant.id, page, limit);
      
      // LOG IMPORTANTE para debug
      console.log("=== DEBUG API RESPONSE ===");
      console.log("Full response:", response);
      console.log("Type:", typeof response);
      console.log("Is array:", Array.isArray(response));
      if (response && typeof response === 'object' && !Array.isArray(response)) {
        console.log("Object keys:", Object.keys(response));
        console.log("Has items?", 'items' in response);
        console.log("Has data?", 'data' in response);
        console.log("Total?", response.total || response.count);
      }
      console.log("=== END DEBUG ===");

      let itemsData: StockItem[] = [];
      let totalPagesData = 1;
      let totalItemsData = 0;

      // Verifica o formato da resposta
      if (Array.isArray(response)) {
        // Se for array direto (backend sem paginação)
        itemsData = response;
        totalItemsData = response.length;
        totalPagesData = Math.ceil(response.length / limit);
        console.log(`📦 Backend retornou array com ${response.length} itens`);
      } else if (response && typeof response === 'object') {
        // Se for objeto com paginação
        itemsData = response.items || response.data || [];
        totalItemsData = response.total || response.count || itemsData.length;
        totalPagesData = response.totalPages || response.pages || 
                         Math.ceil(totalItemsData / limit);
        console.log(`📦 Backend retornou objeto paginado: ${itemsData.length} itens, total ${totalItemsData}`);
      } else {
        console.error("❌ Formato de resposta desconhecido:", response);
      }

      // Atualiza os itens (sempre substitui na paginação tradicional)
      setItems(itemsData);
      setCurrentPage(page);
      setTotalPages(totalPagesData);
      setTotalItems(totalItemsData);

      console.log(`📦 ${itemsData.length} itens carregados (Página ${page}/${totalPagesData})`);

    } catch (error: any) {
      console.error("❌ Erro ao carregar estoque:", error);
      if (page === 1) {
        Alert.alert("Erro", error.message || "Não foi possível carregar o estoque");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [selectedRestaurant?.id]);

  useEffect(() => {
    console.log("🔄 useEffect triggered:", { 
      selectedRestaurantId: selectedRestaurant?.id, 
      refresh
    });
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

  function handleDelete(id: string) {
    console.log("🗑️ Botão delete clicado para ID:", id);
    console.log("🗑️ Item a ser excluído:", items.find(item => item.id === id));
    
    Alert.alert(
      "Excluir item",
      "Tem certeza que deseja excluir este item do estoque?",
      [
        { text: "Cancelar", style: "cancel", onPress: () => console.log("❌ Delete cancelado") },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            console.log("✅ Confirmado delete para ID:", id);
            try {
              console.log("🔄 Chamando deleteStockItem...");
              await deleteStockItem(id);
              console.log("✅ deleteStockItem executado com sucesso");
              Alert.alert("Sucesso", "Item excluído com sucesso");
              // Recarrega a página atual
              loadStock(currentPage);
            } catch (error: any) {
              console.error("❌ Erro no delete:", error);
              console.error("❌ Mensagem:", error.message);
              console.error("❌ Response:", error.response?.data);
              Alert.alert("Erro", error.message || "Erro ao excluir item");
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

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <ActivityIndicator 
          size="small" 
          color={theme.colors.primary} 
        />
      </View>
    );
  };

  const renderHeader = () => {
    if (loading && !refreshing) {
      return (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <ActivityIndicator 
            size="large" 
            color={theme.colors.primary} 
          />
        </View>
      );
    }
    return null;
  };

  if (loading && !refreshing) {
    return (
      <S.ScreenContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <S.EmptyText style={{ marginTop: 16 }}>Carregando estoque...</S.EmptyText>
      </S.ScreenContainer>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `Estoque ${totalItems > 0 ? `(${totalItems})` : ''}`,
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
              onPress={() =>
                router.push("/(private)/stock/items/create-stock")
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
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            !loading && !refreshing ? (
              <S.EmptyContainer>
                <Ionicons
                  name="cube-outline"
                  size={48}
                  color="#999"
                />
                <S.EmptyText>
                  Nenhum item no estoque
                </S.EmptyText>
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
            paddingBottom: 20
          }}
          style={{ flex: 1 }}
        />

        {/* Componente de paginação */}
        {totalPages > 1 && items.length > 0 && (
          <View style={{ 
            paddingHorizontal: 16, 
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            backgroundColor: theme.colors.background
          }}>
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