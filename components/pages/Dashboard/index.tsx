import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import dayjs from "dayjs";
import { getCompletedOrdersByDateRange, ReportData } from "@/services/order";
import { buildDashboardMetrics, buildPaymentMethodMetrics, } from "@/services/salesService";
import useRestaurant from "@/hooks/useRestaurant";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import * as S from "./styles";
import { RevenueMetrics } from "@/components/organisms/Charts/RevenueMetrics";
import { PaymentMethodChart } from "@/components/organisms/Charts/PaymentMethodChart";
import { TopProductsChart } from "@/components/organisms/Charts/TopProductsChart";
import { SalesInsights } from "@/components/organisms/Charts/SalesInsights";

export default function DashboardScreen() {
  const { selectedRestaurant } = useRestaurant();
  const { theme } = useAppTheme();

  const [orders, setOrders] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] =
    useState<'day' | 'week' | 'month'>('day');

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      if (!selectedRestaurant?.id) return;

      const startDate = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
      const endDate = dayjs().format('YYYY-MM-DD');

      const response = await getCompletedOrdersByDateRange(
        selectedRestaurant.id,
        1,
        1000,
        startDate,
        endDate
      );

      setOrders(response.data);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (selectedRestaurant?.id) {
      loadDashboardData();
    }
  }, [selectedRestaurant]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const dashboardMetrics = useMemo(
    () => buildDashboardMetrics(orders),
    [orders]
  );

  const paymentMethodMetrics = useMemo(
    () => buildPaymentMethodMetrics(orders),
    [orders]
  );

  return (
    <S.ScreenContainer>
      <Stack.Screen
        options={{
          title: "Dashboard",
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text.primary,
        }}
      />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      >
        {loading && !refreshing ? (
          <S.LoadingContainer>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <S.LoadingText>Carregando dashboard...</S.LoadingText>
          </S.LoadingContainer>
        ) : (
          <>
            {/* Header */}
            <S.RestaurantHeader>
              <S.RestaurantName>{selectedRestaurant?.name}</S.RestaurantName>
              <S.RestaurantSubtitle>
                Dashboard de Performance
              </S.RestaurantSubtitle>
            </S.RestaurantHeader>

            {/* Métricas principais */}
            <RevenueMetrics metrics={dashboardMetrics} />

            {/* Métodos de pagamento */}
            <PaymentMethodChart
              data={paymentMethodMetrics}
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              onRefresh={loadDashboardData}
            />

            {/* Produtos mais vendidos */}
            <TopProductsChart
              orders={orders}
              selectedPeriod={selectedPeriod}
            />

            {/* Insights */}
            <SalesInsights orders={orders} />
          </>
        )}
      </ScrollView>
    </S.ScreenContainer>
  );
}
