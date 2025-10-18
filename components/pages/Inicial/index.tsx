import React, { useState, useEffect } from "react";
import { Stack, useRouter } from "expo-router";

import useRestaurant from "@/hooks/useRestaurant";
import { HorizontalBarChart } from "@/components/organisms/TopProductsChart/components/HorizontalBarChart";
import { getOrdersByRestaurant } from "@/services/order";
import { SalesService } from "@/services/salesService";
import { ProductSales } from "@/services/types";
import Button from "@/components/atoms/Button";
import LogoutButton from "@/components/atoms/LogoutButton";
import { ThemeToggle } from "@/components/molecules/ToggleTheme";
import * as S from "./styles";
import { Ionicons } from "@expo/vector-icons";

export default function IndexPage() {
  const [salesData, setSalesData] = useState<ProductSales[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { selectedRestaurant } = useRestaurant();
  const router = useRouter();

  useEffect(() => {
    if (selectedRestaurant?.id) loadSalesData();
    else setLoading(false);
  }, [selectedRestaurant?.id]);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!selectedRestaurant?.id) return setError("Nenhum restaurante selecionado");

      const orders = await getOrdersByRestaurant(selectedRestaurant.id, "COMPLETED");
      const salesData = SalesService.getSalesByTimeRange(orders);
      setSalesData(salesData.day);
    } catch {
      setError("Erro ao carregar dados de vendas");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    if (selectedRestaurant?.id) loadSalesData();
  };

  return (
    <S.Container>
      <Stack.Screen
        options={{
          title: "Início",
          headerStyle: { backgroundColor: "#041224" },
          headerTintColor: "#FFF",
        }}
      />

      <S.StyledScrollView>
        <S.LogoutContainer>
          <ThemeToggle />
          <LogoutButton />
        </S.LogoutContainer>

        <S.ChartSection>
          <S.SectionHeader>
            <S.SectionTitle>📊 Pratos Mais Vendidos Hoje</S.SectionTitle>
            <S.HeaderRight>
              {selectedRestaurant && (
                <S.SalesCount>
                  {salesData.length} {salesData.length === 1 ? "produto" : "produtos"} vendidos
                </S.SalesCount>
              )}
              <S.RefreshButton onPress={refreshData} disabled={loading}>
                <Ionicons name="refresh" size={20} color="#04C4D9" />
              </S.RefreshButton>
            </S.HeaderRight>
          </S.SectionHeader>

          {!selectedRestaurant ? (
            <S.EmptyState>
              <S.EmptyText>Selecione um restaurante para ver as vendas</S.EmptyText>
              <Button label="🍴 Selecionar Restaurante" onPress={() => router.push("/(private)/select-restaurant")} />
            </S.EmptyState>
          ) : loading ? (
            <S.LoadingContainer>
              <S.LoadingText>Carregando vendas...</S.LoadingText>
            </S.LoadingContainer>
          ) : error ? (
            <S.ErrorContainer>
              <S.ErrorText>{error}</S.ErrorText>
              <Button label="🔄 Tentar Novamente" onPress={refreshData} />
            </S.ErrorContainer>
          ) : (
            <>
              <HorizontalBarChart data={salesData} />
              <S.ActionsRow>
                <Button label="📊 Dashboard Completo" onPress={() => router.push("/(private)/dashboard")} />
              </S.ActionsRow>
            </>
          )}
        </S.ChartSection>

        {selectedRestaurant && (
          <S.StatusSection>
            <S.StatusItem>
              <S.StatusLabel>Vendas Hoje</S.StatusLabel>
              <S.StatusValue>{salesData.reduce((sum, item) => sum + item.salesCount, 0)}</S.StatusValue>
            </S.StatusItem>
            <S.StatusItem>
              <S.StatusLabel>Produtos</S.StatusLabel>
              <S.StatusValue>{salesData.length}</S.StatusValue>
            </S.StatusItem>
          </S.StatusSection>
        )}
      </S.StyledScrollView>
    </S.Container>
  );
}
