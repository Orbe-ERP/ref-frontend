import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { HorizontalBarChart } from "./components/HorizontalBarChart";
import { VerticalBarChart } from "../VerticalBarChart";
import { PieChart } from "./components/PieChart";
import { PieChartProfit } from "./components/PieChart/PieChartProfit";
import { DashboardProductSales as ProductSales } from "@/services/salesService";
import { Feather } from "@expo/vector-icons";
import { useAppTheme } from "@/context/ThemeProvider/theme";

type ChartType =
  | "bar"
  | "pie-category"
  | "pie-price"
  | "pie-performance"
  | "pie-analysis";

interface TopProductsChartProps {
  data: ProductSales[];
  onRefresh?: () => void;
  variant?: "full" | "mini";
  defaultChartType?: ChartType;
  showInsights?: boolean;
  showRefreshButton?: boolean;
}

export const TopProductsChart: React.FC<TopProductsChartProps> = ({
  data,
  onRefresh,
  variant = "full",
  defaultChartType = "bar",
  showInsights = true,
  showRefreshButton = true,
}) => {
  const { theme } = useAppTheme();
  const [chartType, setChartType] = useState<ChartType>(defaultChartType);

  const sortedData = [...data].sort((a, b) => b.salesCount - a.salesCount);
  const topProduct = sortedData[0];
  const displayData =
    variant === "mini" ? sortedData.slice(0, 5) : sortedData;

  const getChartTypeIcon = (type: ChartType) => {
    switch (type) {
      case "bar":
        return variant === "mini" ? "bar-chart-2" : "bar-chart";
      case "pie-category":
        return "layers";
      case "pie-price":
        return "dollar-sign";
      case "pie-performance":
        return "trending-up";
      case "pie-analysis":
        return "pie-chart";
      default:
        return "bar-chart";
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Feather
            name={getChartTypeIcon(chartType)}
            size={variant === "mini" ? 16 : 20}
            color={theme.colors.primary}
          />

          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            {variant === "mini"
              ? "Produtos Mais Vendidos Hoje"
              : "Análise de Produtos"}
          </Text>
        </View>

        {variant === "mini" && onRefresh && (
          <TouchableOpacity onPress={onRefresh}>
            <Feather name="refresh-cw" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {showInsights && variant === "full" && topProduct && (
        <View
          style={[
            styles.insightContainer,
            {
              backgroundColor: theme.colors.feedback.warning + "20",
              borderLeftColor: theme.colors.feedback.warning,
            },
          ]}
        >
          <Feather name="zap" size={16} color={theme.colors.feedback.warning} />
          <View style={styles.insightContent}>
            <Text
              style={[
                styles.insightTitle,
                { color: theme.colors.feedback.warning },
              ]}
            >
              Destaque do Período
            </Text>
            <Text
              style={[styles.insightText, { color: theme.colors.text.primary }]}
            >
              <Text
                style={[styles.highlight, { color: theme.colors.primary }]}
              >
                {topProduct.productName}
              </Text>{" "}
              lidera com {topProduct.salesCount} vendas
            </Text>
          </View>
        </View>
      )}

      {/* Gráfico */}
      <View style={styles.chartContainer}>
        {displayData.length > 0 ? (
          variant === "mini" ? (
            <VerticalBarChart data={displayData} maxBars={5} />
          ) : chartType === "bar" ? (
            <HorizontalBarChart data={displayData} maxBars={7} />
          ) : chartType === "pie-category" ? (
            <PieChart data={displayData} type="category" />
          ) : chartType === "pie-price" ? (
            <PieChart data={displayData} type="price-range" />
          ) : chartType === "pie-performance" ? (
            <PieChart data={displayData} type="performance" />
          ) : chartType === "pie-analysis" ? (
            <PieChartProfit data={displayData} />
          ) : null
        ) : (
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={32} color={theme.colors.text.muted} />
            <Text style={{ color: theme.colors.text.secondary }}>
              Nenhuma venda hoje
            </Text>
          </View>
        )}
      </View>

      {showRefreshButton && onRefresh && variant === "full" && (
        <TouchableOpacity
          style={[
            styles.refreshButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={onRefresh}
        >
          <Feather name="refresh-cw" size={16} color={theme.colors.surface} />
          <Text style={{ color: theme.colors.surface, marginLeft: 8 }}>
            Atualizar Dados
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
  },
  miniContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  miniTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  chartTypeSelector: {
    flexDirection: "row",
    borderRadius: 8,
    padding: 4,
  },
  chartTypeButton: {
    padding: 8,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  chartTypeButtonActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  fullDashboardButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
  },
  fullDashboardText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  timeFilter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderRadius: 10,
    padding: 4,
  },
  timeFilterButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  timeFilterButtonActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  timeFilterText: {
    fontSize: 13,
    fontWeight: "500",
  },
  timeFilterTextActive: {
    fontWeight: "600",
  },
  insightContainer: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "flex-start",
  },
  insightContent: {
    flex: 1,
    marginLeft: 12,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  insightText: {
    fontSize: 13,
    lineHeight: 18,
  },
  highlight: {
    fontWeight: "700",
  },
  chartContainer: {
    minHeight: 250,
  },
  miniChartContainer: {
    minHeight: 180,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  miniEmptyContainer: {
    padding: 20,
    minHeight: 120,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 16,
    textAlign: "center",
  },
  miniEmptyText: {
    fontSize: 14,
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
  refreshButton: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  refreshButtonText: {
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
  },
  chartTypeLabels: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    flexWrap: "wrap",
    gap: 8,
  },
  chartTypeLabelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
  },
  chartTypeLabelButtonActive: {
    backgroundColor: "#3B82F6",
  },
  chartTypeLabelText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  chartTypeLabelTextActive: {
    color: "#FFFFFF",
  },
});

// Exportando os tipos necessários
export type { ChartType };