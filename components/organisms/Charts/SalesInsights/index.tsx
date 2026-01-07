import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/context/ThemeProvider/theme';
import { ReportData } from '@/services/order';
import { buildPaymentMethodMetrics } from '@/services/salesService';

interface SalesInsightsProps {
  orders: ReportData[];
}

export const SalesInsights: React.FC<SalesInsightsProps> = ({ orders }) => {
  const { theme } = useAppTheme();

  const insights = useMemo(() => {
    if (orders.length === 0) return [];

    const insightsList: {
      type: 'success' | 'warning' | 'info' | 'error';
      icon: keyof typeof Feather.glyphMap;
      title: string;
      description: string;
      detail?: string;
    }[] = [];

    /* =====================================================
       1. MÉTODOS DE PAGAMENTO (NOVO SERVICE)
    ===================================================== */
    const paymentMetrics = buildPaymentMethodMetrics(orders);

    if (paymentMetrics.length > 0) {
      const mostUsed = [...paymentMetrics].sort(
        (a, b) => b.totalValue - a.totalValue
      )[0];

      insightsList.push({
        type: 'success',
        icon: 'credit-card',
        title: 'Método Mais Utilizado',
        description: `${mostUsed.method} lidera em receita`,
        detail: `Participação: ${mostUsed.percentage.toFixed(1)}%`,
      });
    }

    /* =====================================================
       2. PERÍODO DE PICO
    ===================================================== */
    const hourGroups: Record<string, number> = {};

    orders.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      const period =
        hour < 12 ? 'Manhã' :
        hour < 18 ? 'Tarde' : 'Noite';

      hourGroups[period] = (hourGroups[period] || 0) + 1;
    });

    const busiestPeriod = Object.entries(hourGroups)
      .reduce(
        (max, [period, count]) =>
          count > max.count ? { period, count } : max,
        { period: '', count: 0 }
      );

    if (busiestPeriod.count > 0) {
      insightsList.push({
        type: 'warning',
        icon: 'clock',
        title: 'Período de Pico',
        description: `${busiestPeriod.period} concentra mais pedidos`,
        detail: `${busiestPeriod.count} pedidos`,
      });
    }

    /* =====================================================
       3. TICKET MÉDIO
    ===================================================== */
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalValue,
      0
    );

    const avgTicket = totalRevenue / orders.length;

    if (avgTicket > 0) {
      insightsList.push({
        type: avgTicket < 30 ? 'warning' : 'success',
        icon: 'shopping-cart',
        title: 'Ticket Médio',
        description: `R$ ${avgTicket.toFixed(2)} por pedido`,
        detail:
          avgTicket < 30
            ? 'Considere oferecer combos ou adicionais'
            : 'Bom valor médio por comanda',
      });
    }

    /* =====================================================
       4. PRODUTOS POR PEDIDO
    ===================================================== */
    const totalProducts = orders.reduce((sum, order) => {
      return (
        sum +
        order.products.reduce(
          (pSum, p) => pSum + p.quantity,
          0
        )
      );
    }, 0);

    const avgProductsPerOrder = totalProducts / orders.length;

    insightsList.push({
      type: 'info',
      icon: 'package',
      title: 'Produtos por Pedido',
      description: `Média de ${avgProductsPerOrder.toFixed(1)} itens`,
      detail: `${totalProducts} produtos vendidos`,
    });

    return insightsList.slice(0, 4);
  }, [orders]);

  const getTypeColor = (type: 'success' | 'warning' | 'info' | 'error') => {
    switch (type) {
      case 'success': return theme.colors.feedback.success;
      case 'warning': return theme.colors.feedback.warning;
      case 'error': return theme.colors.feedback.error;
      default: return theme.colors.feedback.info;
    }
  };

  if (insights.length === 0) return null;

  return (
    <View style={{ borderRadius: 16, padding: 20 }}>
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <Feather name="zap" size={20} color={theme.colors.primary} />
        <Text
          style={{
            marginLeft: 8,
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text.primary,
          }}
        >
          Insights e Recomendações
        </Text>
      </View>

      {insights.map((insight, index) => {
        const color = getTypeColor(insight.type);

        return (
          <View
            key={index}
            style={{
              borderRadius: 8,
              padding: 16,
              marginBottom: 8,
              backgroundColor: color + '10',
              borderLeftColor: color,
              borderLeftWidth: 4,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                  backgroundColor: color + '20',
                }}
              >
                <Feather name={insight.icon} size={16} color={color} />
              </View>

              <Text style={{ fontSize: 14, fontWeight: '700', color }}>
                {insight.title}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                marginBottom: 4,
                color: theme.colors.text.primary,
              }}
            >
              {insight.description}
            </Text>

            {insight.detail && (
              <Text
                style={{
                  fontSize: 12,
                  color: theme.colors.text.secondary,
                }}
              >
                {insight.detail}
              </Text>
            )}
          </View>
        );
      })}

      <View
        style={{
          marginTop: 16,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            textAlign: 'center',
            color: theme.colors.text.muted,
          }}
        >
          Baseado em {orders.length} pedidos • Última atualização: agora
        </Text>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  insightsList: {
    gap: 12,
  },
  insightCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  insightDescription: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 20,
  },
  insightDetail: {
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 11,
    textAlign: 'center',
  },
});