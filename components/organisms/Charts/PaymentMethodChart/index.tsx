import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/context/ThemeProvider/theme';
import { PaymentMethodMetrics } from '@/services/salesService';

interface PaymentMethodChartProps {
  data: PaymentMethodMetrics[];
  selectedPeriod: 'day' | 'week' | 'month';
  onPeriodChange: (period: 'day' | 'week' | 'month') => void;
  onRefresh?: () => void;
}

export const PaymentMethodChart: React.FC<PaymentMethodChartProps> = ({
  data,
  selectedPeriod,
  onPeriodChange,
  onRefresh,
}) => {
  const { theme } = useAppTheme();

  const PAYMENT_UI = {
    CREDIT_CARD: {
      label: 'Crédito',
      icon: 'credit-card',
      color: theme.colors.primary,
    },
    DEBIT_CARD: {
      label: 'Débito',
      icon: 'credit-card',
      color: theme.colors.accent,
    },
    PIX: {
      label: 'Pix',
      icon: 'smartphone',
      color: theme.colors.feedback.success,
    },
    CASH: {
      label: 'Dinheiro',
      icon: 'dollar-sign',
      color: theme.colors.secondary,
    },
    OTHER: {
      label: 'Outros',
      icon: 'more-horizontal',
      color: theme.colors.text.muted,
    },
  } as const;

  const totalRevenue = data.reduce(
    (sum, item) => sum + item.totalValue,
    0
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 2,
    }).format(value);

  const periods = [
    { key: 'day', label: 'Hoje', icon: 'sun' },
    { key: 'week', label: 'Semana', icon: 'calendar' },
    { key: 'month', label: 'Mês', icon: 'bar-chart-2' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Feather name="credit-card" size={20} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Receita por Método de Pagamento
          </Text>
        </View>

        {onRefresh && (
          <TouchableOpacity onPress={onRefresh}>
            <Feather
              name="refresh-cw"
              size={18}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Seletor de Período */}
      <View
        style={[
          styles.periodSelector,
          { backgroundColor: theme.colors.background },
        ]}
      >
        {periods.map((period) => (
          <TouchableOpacity
            key={period.key}
            style={[
              styles.periodButton,
              selectedPeriod === period.key && {
                backgroundColor: theme.colors.surface,
              },
            ]}
            onPress={() => onPeriodChange(period.key as any)}
          >
            <Feather
              name={period.icon as any}
              size={14}
              color={
                selectedPeriod === period.key
                  ? theme.colors.primary
                  : theme.colors.text.secondary
              }
            />
            <Text
              style={[
                styles.periodButtonText,
                {
                  color:
                    selectedPeriod === period.key
                      ? theme.colors.primary
                      : theme.colors.text.secondary,
                },
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Total */}
      <View
        style={[
          styles.totalContainer,
          { backgroundColor: theme.colors.primary + '10' },
        ]}
      >
        <Text
          style={[
            styles.totalLabel,
            { color: theme.colors.text.secondary },
          ]}
        >
          Receita Total
        </Text>
        <Text
          style={[
            styles.totalValue,
            { color: theme.colors.text.primary },
          ]}
        >
          {formatCurrency(totalRevenue)}
        </Text>
      </View>

      {/* Lista */}
      <View style={styles.methodsList}>
        {data.map((item) => {
          const ui = PAYMENT_UI[item.method];

          return (
            <View key={item.method} style={styles.methodItem}>
              <View style={styles.methodLeft}>
                <View
                  style={[
                    styles.methodIcon,
                    { backgroundColor: ui.color + '20' },
                  ]}
                >
                  <Feather
                    name={ui.icon as any}
                    size={16}
                    color={ui.color}
                  />
                </View>

                <Text
                  style={[
                    styles.methodLabel,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  {ui.label}
                </Text>
              </View>

              <View style={styles.methodRight}>
                <Text
                  style={[
                    styles.methodRevenue,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  {formatCurrency(item.totalValue)}
                </Text>
                <Text
                  style={[
                    styles.methodPercentage,
                    { color: ui.color },
                  ]}
                >
                  {item.percentage.toFixed(1)}%
                </Text>
              </View>
            </View>
          );
        })}

        {data.length === 0 && (
          <View style={styles.emptyContainer}>
            <Feather
              name="credit-card"
              size={32}
              color={theme.colors.text.muted}
            />
            <Text
              style={[
                styles.emptyText,
                { color: theme.colors.text.secondary },
              ]}
            >
              Nenhuma transação registrada
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  periodSelector: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  periodButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  periodButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  periodButtonTextActive: {
    fontWeight: '600',
  },
  totalContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  methodsList: {
    marginTop: 8,
  },
  methodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  methodStats: {
    fontSize: 11,
  },
  methodRight: {
    alignItems: 'flex-end',
  },
  methodRevenue: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  methodPercentage: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
});