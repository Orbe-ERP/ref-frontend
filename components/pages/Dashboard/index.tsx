import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { getOrdersByRestaurant } from "@/services/order";
import { SalesService } from "@/services/salesService";
import { SalesTimeRange } from "@/services/types";
import { TopProductsChart } from "@/components/organisms/TopProductsChart";
import useRestaurant from "@/hooks/useRestaurant";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import * as S from "./styles";

export default function DashboardScreen() {
  const { selectedRestaurant } = useRestaurant();

  const [salesData, setSalesData] = useState<SalesTimeRange | null>(null);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const theme = useAppTheme();

  const loadSalesData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedRestaurant) {
        setError("Nenhum restaurante selecionado");
        return;
      }

      const orders = await getOrdersByRestaurant(
        selectedRestaurant.id,
        "COMPLETED"
      );

      const processed = SalesService.getSalesByTimeRange(orders);

      setSalesData(processed);

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);

      const totalResponse = await SalesService.getTotalProductsSold(
        selectedRestaurant.id,
        startDate,
        endDate
      );

      const totalProductsSold = totalResponse.reduce(
        (acc: number, product: ProductTotal) => acc + product.totalQuantity,
        0
      );

      setTotalProducts(totalProductsSold);
    } catch (err) {
      console.error("Erro ao carregar dados de vendas:", err);
      setError("Erro ao carregar dados de vendas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRestaurant?.id) loadSalesData();
    else setLoading(false);
  }, [selectedRestaurant]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Dashboard",
          headerStyle: { backgroundColor: theme.theme.colors.background },
          headerTintColor: theme.theme.colors.text.primary,
        }}
      />

      <S.ScrollView>
        {loading ? (
          <S.View>
            <ActivityIndicator size="large" color="#45B7D1" />
            <S.Text>Carregando dados...</S.Text>
          </S.View>
        ) : error ? (
          <S.View>
            <S.Text>{error}</S.Text>
          </S.View>
        ) : (
          <>
            {totalProducts !== null && (
              <S.View>
                <S.Text>
                  📦 Produtos Vendidos (7 dias)
                </S.Text>
                <S.Text>{totalProducts}</S.Text>
              </S.View>
            )}

            <TopProductsChart
              salesData={salesData}
              onRefresh={loadSalesData}
              variant="full"
              showFilters
              showInsights
              showRefreshButton
            />
          </>
        )}
      </S.ScrollView>
    </>
  );
}
