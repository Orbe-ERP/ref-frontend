import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import useRestaurant from "@/hooks/useRestaurant";
import { HorizontalBarChart } from "@/components/organisms/TopProductsChart/components/HorizontalBarChart";
import { SalesService } from "@/services/salesService";
import { getOrdersByRestaurant } from "@/services/order";
import { ProductSales } from "@/services/types";
import Button from "@/components/atoms/Button";
import { Ionicons } from "@expo/vector-icons";
import LogoutIcon from "@/components/atoms/LogoutButton";
import LogoutButton from "@/components/atoms/LogoutButton";

const COLORS = {
  primary: "#041224",
  secondary: "#038082",
  accent: "#04C4D9",
  background: "#0A1A2F",
  text: {
    primary: "#FFFFFF",
    secondary: "#B0BEC5",
    accent: "#04C4D9",
  },
};

export default function IndexScreen() {
  const [salesData, setSalesData] = useState<ProductSales[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedRestaurant } = useRestaurant();
  const router = useRouter();

  useEffect(() => {
    if (selectedRestaurant?.id) {
      loadSalesData();
    } else {
      setLoading(false);
    }
  }, [selectedRestaurant?.id]);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedRestaurant?.id) {
        setError("Nenhum restaurante selecionado");
        return;
      }

      const orders = await getOrdersByRestaurant(
        selectedRestaurant.id,
        "COMPLETED"
      );
      const salesData = SalesService.getSalesByTimeRange(orders);
      setSalesData(salesData.day);
    } catch (error) {
      console.error("Erro ao carregar dados de vendas:", error);
      setError("Erro ao carregar dados de vendas");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    if (selectedRestaurant?.id) {
      loadSalesData();
    }
  };

  const sortedSales = [...salesData].sort(
    (a, b) => b.salesCount - a.salesCount
  );
  const topProduct = sortedSales[0] || null;
  const totalSalesCount = sortedSales.reduce(
    (sum, item) => sum + item.salesCount,
    0
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Início",
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.text.primary,
          headerTitleStyle: { color: COLORS.text.primary },
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.logoutContainer}>
          <LogoutButton/>
        </View>

        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              📊 Pratos Mais Vendidos Hoje
            </Text>
            <View style={styles.headerRight}>
              {selectedRestaurant && (
                <Text style={styles.salesCount}>
                  {salesData.length}{" "}
                  {salesData.length === 1 ? "produto" : "produtos"}{" "}
                  {salesData.length === 1 ? "tipo" : "diferentes"} vendidos
                </Text>
              )}
              <TouchableOpacity
                onPress={refreshData}
                style={styles.refreshButton}
                disabled={loading}
              >
                <Ionicons name="refresh" size={20} color={COLORS.text.accent} />
              </TouchableOpacity>
            </View>
          </View>

          {!selectedRestaurant ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Selecione um restaurante para ver as vendas
              </Text>
              <Button
                label="🍴 Selecionar Restaurante"
                onPress={() => router.push("/(private)/select-restaurant")}
              />
            </View>
          ) : loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.secondary} />
              <Text style={styles.loadingText}>Carregando vendas...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Button label="🔄 Tentar Novamente" onPress={refreshData} />
            </View>
          ) : (
            <>
              <HorizontalBarChart data={salesData} />

              {topProduct && (
                <View style={styles.insightContainer}>
                  <Text style={styles.insightTitle}>💡 Destaque do Dia</Text>
                  <Text style={styles.insightText}>
                    <Text style={styles.highlight}>
                      {topProduct.productName}
                    </Text>{" "}
                    lidera com{" "}
                    <Text style={styles.highlight}>
                      {topProduct.salesCount} vendas
                    </Text>
                  </Text>
                </View>
              )}

              <View style={styles.actionsRow}>
                <Button
                  label="📊 Dashboard Completo"
                  onPress={() => router.push("/(private)/dashboard")}
                />
              </View>
            </>
          )}
        </View>

        {/* Acesso Rápido */}
        <View style={styles.menuSection}>
          <View style={styles.menuColumn}>
            <Button
              label="🍴 Selecionar Restaurante"
              onPress={() => router.push("/(private)/select-restaurant")}
            />
            <Button
              label="👨‍🍳 Cozinha"
              onPress={() => router.push("/(private)/kitchen")}
            />
            <Button
              label="📈 Relatórios"
              onPress={() => router.push("/(private)/report")}
            />
            <Button
              label="📱 Tutorial"
              onPress={() => router.push("/(private)/onboarding")}
            />
          </View>
        </View>

        {/* Status */}
        {selectedRestaurant && (
          <View style={styles.statusSection}>

            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Vendas Hoje</Text>
              <Text style={styles.statusValue}>
                {salesData.reduce((sum, item) => sum + item.salesCount, 0)}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Produtos</Text>
              <Text style={styles.statusValue}>{salesData.length}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  scrollView: { flex: 1 },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    minHeight: "100%",
  },

  logoutContainer: {
    alignItems: "flex-end",
    marginBottom: 12,
  },

  chartSection: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  refreshButton: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: "rgba(3,128,130,0.1)",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text.primary,
  },
  salesCount: {
    fontSize: 12,
    color: COLORS.text.accent,
    fontWeight: "600",
  },

  menuSection: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  menuColumn: {
    flexDirection: "column",
    gap: 6,
    marginTop: 8,
  },
  menuButton: {
    backgroundColor: "rgba(3,128,130,0.15)",
    borderWidth: 1,
    borderColor: COLORS.secondary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    height: 36,
    justifyContent: "center",
  },
  menuButtonText: {
    color: COLORS.text.accent,
    fontWeight: "500",
    fontSize: 12,
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 36,
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "rgba(3,128,130,0.15)",
    borderWidth: 1,
    borderColor: COLORS.secondary,
    paddingVertical: 8,
    borderRadius: 8,
    height: 36,
    justifyContent: "center",
    flex: 1,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.text.secondary,
    paddingVertical: 8,
    borderRadius: 8,
    height: 36,
    justifyContent: "center",
  },
  buttonText: {
    color: COLORS.text.primary,
    fontWeight: "500",
    fontSize: 12,
    textAlign: "center",
  },
  outlineButtonText: {
    color: COLORS.text.secondary,
    fontWeight: "500",
    fontSize: 12,
    textAlign: "center",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },

  loadingContainer: { padding: 30, alignItems: "center" },
  loadingText: { marginTop: 10, color: COLORS.text.secondary, fontSize: 13 },

  errorContainer: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "rgba(211,47,47,0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(211,47,47,0.3)",
  },
  errorText: {
    color: "#FF6B6B",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 13,
  },

  emptyState: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "rgba(3,128,130,0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(3,128,130,0.3)",
  },
  emptyText: {
    color: COLORS.text.accent,
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "500",
  },

  insightContainer: {
    backgroundColor: "rgba(3,128,130,0.15)",
    padding: 12,
    borderRadius: 10,
    marginTop: 14,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondary,
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.text.accent,
    marginBottom: 4,
  },
  insightText: { fontSize: 12, color: COLORS.text.primary, lineHeight: 18 },
  highlight: { fontWeight: "bold", color: COLORS.text.accent },

  statusSection: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginBottom: 20,
  },
  statusItem: { alignItems: "center" },
  statusLabel: {
    fontSize: 11,
    color: COLORS.text.secondary,
    marginBottom: 4,
    fontWeight: "500",
  },
  statusValue: { fontSize: 14, fontWeight: "bold", color: COLORS.text.primary },
  statusOnline: {
    backgroundColor: "rgba(76,175,80,0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
});
