import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAppTheme } from "@/context/ThemeProvider/theme";
import { DashboardMetrics } from "@/services/salesService";

interface RevenueMetricsProps {
  metrics: DashboardMetrics;
  trends?: {
    revenueChange?: number;
    ordersChange?: number;
    ticketChange?: number;
  };
}

export const RevenueMetrics: React.FC<RevenueMetricsProps> = ({
  metrics,
  trends = {},
}) => {
  const { theme } = useAppTheme();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(value);

  const formatNumber = (value: number) =>
    value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();

  const getTrendIcon = (change?: number) => {
    if (change === undefined) return null;
    if (change > 0)
      return { icon: "trending-up", color: theme.colors.feedback.success };
    if (change < 0)
      return { icon: "trending-down", color: theme.colors.feedback.error };
    return { icon: "minus", color: theme.colors.text.secondary };
  };

  const cards = [
    {
      title: "Receita Total",
      value: formatCurrency(metrics.totalRevenue),
      icon: "dollar-sign" as const,
      color: theme.colors.feedback.success,
      trend: trends.revenueChange,
      subtitle: "Valor arrecadado",
    },
    {
      title: "Pedidos",
      value: formatNumber(metrics.totalOrders),
      icon: "shopping-bag" as const,
      color: theme.colors.primary,
      trend: trends.ordersChange,
      subtitle: "Comandas finalizadas",
    },
    {
      title: "Ticket Médio",
      value: formatCurrency(metrics.averageTicket),
      icon: "tag" as const,
      color: theme.colors.accent,
      trend: trends.ticketChange,
      subtitle: "Média por pedido",
    },
    {
      title: "Produtos Vendidos",
      value: formatNumber(metrics.totalProductsSold),
      icon: "package" as const,
      color: theme.colors.secondary,
      subtitle: "Itens vendidos",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {cards.map((card, index) => {
          const trend = getTrendIcon(card.trend);

          return (
            <View
              key={index}
              style={[
                styles.card,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: card.color + "15" },
                  ]}
                >
                  <Feather name={card.icon} size={20} color={card.color} />
                </View>

                {trend && card.trend !== undefined && (
                  <View style={styles.trendContainer}>
                    <Feather
                      name={trend.icon as any}
                      size={12}
                      color={trend.color}
                    />
                    <Text style={[styles.trendText, { color: trend.color }]}>
                      {Math.abs(card.trend)}%
                    </Text>
                  </View>
                )}
              </View>

              <Text style={[styles.value, { color: theme.colors.text.primary }]}>
                {card.value}
              </Text>

              <Text
                style={[styles.title, { color: theme.colors.text.secondary }]}
              >
                {card.title}
              </Text>

              <Text
                style={[
                  styles.subtitle,
                  { color: theme.colors.text.muted },
                ]}
              >
                {card.subtitle}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({ 
  container: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
  }, 
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    gap: 12, 
  }, 
  card: { 
    flex: 1, 
    minWidth: '48%', 
    borderRadius: 12, 
    padding: 16, 
    borderWidth: 1, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 2, 
    marginBottom: 12, 
  }, 
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 12, 
  }, 
  iconContainer: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
  }, 
  trendContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.03)', 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 8, 
  }, 
  trendText: { 
    fontSize: 10, 
    fontWeight: '600', 
    marginLeft: 2, 
  }, 
  value: { 
    fontSize: 22, 
    fontWeight: '700', 
    marginBottom: 4, 
  }, 
  title: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 2, 
  }, 
  subtitle: { 
    fontSize: 11, 
  }, 
});
