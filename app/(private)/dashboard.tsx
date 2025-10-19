import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
} from "react-native";
import { Stack } from "expo-router";
import { getOrdersByRestaurant } from "@/services/order";
import { SalesService } from "@/services/salesService";
import { SalesTimeRange } from "@/services/types";
import { TopProductsChart } from "@/components/organisms/TopProductsChart";
import useRestaurant from "@/hooks/useRestaurant";

export default function DashboardScreen() {
  const { selectedRestaurant } = useRestaurant();

  const [salesData, setSalesData] = useState<SalesTimeRange | null>(null);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      console.log("processed", processed);

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

        }}
      />

      <ScrollView style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#45B7D1" />
            <Text style={styles.loadingText}>Carregando dados...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <>
            {totalProducts !== null && (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>
                  📦 Produtos Vendidos (7 dias)
                </Text>
                <Text style={styles.summaryValue}>{totalProducts}</Text>
              </View>
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
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#041224",
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    color: "#fff",
    fontSize: 16,
  },
  errorContainer: {
    padding: 40,
    alignItems: "center",
  },
  errorText: {
    color: "#ff4d4f",
    fontSize: 16,
    marginTop: 16,
  },
  summaryCard: {
    backgroundColor: "#0A2647",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  summaryTitle: {
    color: "#45B7D1",
    fontSize: 16,
    fontWeight: "500",
  },
  summaryValue: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 6,
  },
});
