import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { HorizontalBarChart } from "./components/HorizontalBarChart";
import { PieChart } from "./components/PieChart";
import { SalesTimeRange, ChartType, ProductSales } from "@/services/types";
import { SalesService } from "@/services/salesService";

interface TopProductsChartProps {
  salesData: SalesTimeRange | null;
  onRefresh?: () => void;
  variant?: "full" | "mini";
  defaultChartType?: ChartType;
  showFilters?: boolean;
  showInsights?: boolean;
  showRefreshButton?: boolean;
}

export const TopProductsChart: React.FC<TopProductsChartProps> = ({
  salesData,
  onRefresh,
  variant = "full",
  defaultChartType = "bar",
  showFilters = true,
  showInsights = true,
  showRefreshButton = true,
}) => {
  const [selectedRange, setSelectedRange] = useState<keyof SalesTimeRange>("day");
  const [chartType, setChartType] = useState<ChartType>(defaultChartType);

  const timeRanges = SalesService.getTimeRanges();
  const currentData: ProductSales[] = salesData?.[selectedRange] || [];

  const sortedData = [...currentData].sort((a, b) => b.salesCount - a.salesCount);
  const topProduct = sortedData[0];

  const displayData = variant === "mini" ? salesData?.day || [] : currentData;

  return (
    <View style={[styles.container, variant === "mini" && styles.miniContainer]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {variant === "mini" ? "📊 Pratos Mais Vendidos Hoje" : "🍽️ Pratos Mais Vendidos"}
        </Text>

        {variant === "full" && (
          <View style={styles.chartTypeSelector}>
            <TouchableOpacity
              style={[styles.chartTypeButton, chartType === "bar" && styles.chartTypeButtonActive]}
              onPress={() => setChartType("bar")}
            >
              <Text
                style={[styles.chartTypeText, chartType === "bar" && styles.chartTypeTextActive]}
              >
                Barras
              </Text>
            </TouchableOpacity>

          </View>
        )}
      </View>

      {showFilters && variant === "full" && (
        <View style={styles.timeFilter}>
          {timeRanges.map((range) => (
            <TouchableOpacity
              key={range.value}
              style={[
                styles.timeFilterButton,
                selectedRange === range.value && styles.timeFilterButtonActive,
              ]}
              onPress={() => setSelectedRange(range.value)}
            >
              <Text
                style={[
                  styles.timeFilterText,
                  selectedRange === range.value && styles.timeFilterTextActive,
                ]}
              >
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {showInsights && variant === "full" && topProduct && (
        <View style={styles.insightContainer}>
          <Text style={styles.insightTitle}>💡 Insight</Text>
          <Text style={styles.insightText}>
            <Text style={styles.highlight}>{topProduct.productName}</Text> é o campeão com{" "}
            {topProduct.salesCount} vendas
            {topProduct.salesCount > 10 ? " - Considere aumentar o estoque!" : ""}
          </Text>
        </View>
      )}

      <View style={styles.chartContainer}>
        {displayData.length > 0 ? (
          variant === "mini" ? (
            <HorizontalBarChart data={displayData} maxBars={5} />
          ) : chartType === "bar" ? (
            <HorizontalBarChart data={displayData} maxBars={5} />
          ) : (
            <PieChart data={displayData} maxItems={5} />
          )
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {variant === "mini" ? "Nenhuma venda hoje" : "Nenhuma venda no período selecionado"}
            </Text>
          </View>
        )}
      </View>

      {showRefreshButton && onRefresh && (
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Text style={styles.refreshButtonText}>🔄 Atualizar Dados</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0A1A2F",
    borderRadius: 12,
    borderColor: "#fff",
    borderWidth: 1,
    padding: 16,
    margin: 10,
  },
  miniContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  chartTypeSelector: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 2,
  },
  chartTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  chartTypeButtonActive: {
    backgroundColor: "white",
  },
  chartTypeText: {
    fontSize: 12,
    color: "#666",
  },
  chartTypeTextActive: {
    color: "#264653",
    fontWeight: "500",
  },
  timeFilter: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 6,
  },
  timeFilterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  timeFilterButtonActive: {
    backgroundColor: "#2BAE66",
  },
  timeFilterText: {
    fontSize: 14,
    color: "#264653",
    fontWeight: "500",
  },
  timeFilterTextActive: {
    color: "#0A1A2F",
  },
  insightContainer: {
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 4,
  },
  insightText: {
    fontSize: 12,
    color: "#424242",
  },
  highlight: {
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  chartContainer: {
    minHeight: 200,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontStyle: "italic",
  },
  refreshButton: {
    backgroundColor: "#2BAE66",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  refreshButtonText: {
    color: "#0A1A2F",
    fontWeight: "bold",
  },
});
