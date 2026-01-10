import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import dayjs from "dayjs";
import { getCompletedOrdersByDateRange, ReportData } from "@/services/order";
import {
  buildDashboardMetrics,
  buildPaymentMethodMetrics,
} from "@/services/salesService";
import useRestaurant from "@/hooks/useRestaurant";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import * as S from "./styles";
import { RevenueMetrics } from "@/components/organisms/Charts/RevenueMetrics";
import { PaymentMethodChart } from "@/components/organisms/Charts/PaymentMethodChart";
import { TopProductsChart } from "@/components/organisms/Charts/TopProductsChart";
import { SalesInsights } from "@/components/organisms/Charts/SalesInsights";
import { Ionicons } from "@expo/vector-icons";
import { useResponsive } from "@/hooks/useResponsive";

export default function DashboardScreen() {
  const { selectedRestaurant } = useRestaurant();
  const { theme } = useAppTheme();

  const [orders, setOrders] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "day" | "week" | "month"
  >("day");
  const { isTablet, isDesktop } = useResponsive();

  const getDateRangeByPeriod = (
  period: 'day' | 'week' | 'month'
) => {
  const today = dayjs();

  switch (period) {
    case 'day':
      return {
        startDate: today.startOf('day').format('YYYY-MM-DD'),
        endDate: today.add(1, 'day').startOf('day').format('YYYY-MM-DD'),
      };

    case 'week':
      return {
        startDate: today.subtract(6, 'day').startOf('day').format('YYYY-MM-DD'),
        endDate: today.add(1, 'day').startOf('day').format('YYYY-MM-DD'),
      };

    case 'month':
      return {
        startDate: today.subtract(30, 'day').startOf('day').format('YYYY-MM-DD'),
        endDate: today.add(1, 'day').startOf('day').format('YYYY-MM-DD'),
      };
  }
};

const loadDashboardData = async () => {
  try {
    setLoading(true);

    if (!selectedRestaurant?.id) return;
    
    const { startDate, endDate } =
    getDateRangeByPeriod(selectedPeriod);
    
    const response = await getCompletedOrdersByDateRange(
      selectedRestaurant.id,
      1,
      1000,
      startDate,
      endDate
    );

    setOrders(response.data);
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};


  useEffect(() => {
    if (selectedRestaurant?.id) {
      loadDashboardData();
    }
  }, [selectedRestaurant, selectedPeriod]);

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
            <TopProductsChart orders={orders} selectedPeriod={selectedPeriod} />

            {/* Insights */}
            <SalesInsights orders={orders} />

            {/* Informativo sobre período */}
            <S.ToastNotice isTablet={isTablet} isDesktop={isDesktop}>
              <S.ToastIcon>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={theme.colors.feedback.warning}
                />
              </S.ToastIcon>

              <S.ToastContent>
                <S.ToastTitle>Período de dados</S.ToastTitle>
                <S.ToastText>
                  Os filtros de <S.ToastStrong>Semana</S.ToastStrong> e{" "}
                  <S.ToastStrong>Mês</S.ToastStrong> representam, respectivamente, os{" "}
                  <S.ToastStrong>últimos 7 dias</S.ToastStrong> e{" "}
                  <S.ToastStrong>últimos 30 dias</S.ToastStrong> a partir de hoje.
                  Em breve será possível escolher um intervalo de datas personalizado.
                </S.ToastText>
              </S.ToastContent>
            </S.ToastNotice>
          </>
        )}
      </ScrollView>
    </S.ScreenContainer>
  );
}
