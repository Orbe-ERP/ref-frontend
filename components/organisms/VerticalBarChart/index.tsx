import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ProductSales } from '@/services/types';
import { useAppTheme } from '@/context/ThemeProvider/theme';

interface VerticalBarChartProps {
  data: ProductSales[];
  maxBars?: number;
  showValues?: boolean;
  height?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DEFAULT_CHART_HEIGHT = 180;
const DEFAULT_BAR_WIDTH = 32;
const SPACING = 8;

export const VerticalBarChart: React.FC<VerticalBarChartProps> = ({
  data,
  maxBars = 5,
  showValues = true,
  height = DEFAULT_CHART_HEIGHT,
}) => {
  const { theme } = useAppTheme();

  /**
   * Ordena os produtos por quantidade de vendas
   * e limita pelo maxBars
   */
  const sortedData = [...data]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, maxBars);

  /**
   * Estado vazio
   */
  if (sortedData.length === 0) {
    return (
      <View style={[styles.emptyContainer, { height }]}>
        <Text
          style={[
            styles.emptyText,
            { color: theme.colors.text.secondary },
          ]}
        >
          Nenhuma venda no período
        </Text>
      </View>
    );
  }

  /**
   * Escala do gráfico
   */
  const maxSales = Math.max(
    ...sortedData.map(item => item.salesCount)
  );

  /**
   * Paleta de cores (rotativa)
   */
  const barColors = [
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.accent,
    theme.colors.feedback.success,
    theme.colors.feedback.info,
  ];

  /**
   * Largura dinâmica das barras
   */
  const availableWidth = SCREEN_WIDTH - 32;
  const totalBars = sortedData.length;
  const totalSpacing = (totalBars - 1) * SPACING;

  const barWidth = Math.min(
    DEFAULT_BAR_WIDTH,
    (availableWidth - totalSpacing) / totalBars
  );

  /**
   * Helpers
   */
  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const formatProductName = (name: string) => {
    if (name.length > 12) return `${name.slice(0, 10)}...`;
    return name;
  };

  return (
    <View style={[styles.container, { height }]}>
      {/* Barras */}
      <View style={styles.barsContainer}>
        {sortedData.map((item, index) => {
          const barHeight =
            (item.salesCount / maxSales) * (height - 60);

          const color =
            barColors[index % barColors.length];

          return (
            <View
              key={item.productId}
              style={styles.barColumn}
            >
              {/* Valor */}
              {showValues && (
                <Text
                  style={[
                    styles.valueText,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  {formatNumber(item.salesCount)}
                </Text>
              )}

              {/* Barra */}
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      width: barWidth,
                      backgroundColor: color,
                      borderTopLeftRadius: 6,
                      borderTopRightRadius: 6,
                    },
                  ]}
                >
                  {/* Highlight */}
                  <View style={styles.barInner}>
                    <View
                      style={[
                        styles.barHighlight,
                        {
                          backgroundColor:
                            theme.colors.surface,
                          opacity: 0.2,
                        },
                      ]}
                    />
                  </View>
                </View>

                {/* Base */}
                <View
                  style={[
                    styles.barBase,
                    {
                      width: barWidth + 4,
                      backgroundColor:
                        theme.colors.border,
                    },
                  ]}
                />
              </View>

              {/* Label */}
              <Text
                style={[
                  styles.labelText,
                  {
                    color:
                      theme.colors.text.secondary,
                  },
                ]}
                numberOfLines={2}
              >
                {formatProductName(item.productName)}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Rodapé */}
      {sortedData.length > 3 && (
        <View style={styles.footer}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: barColors[0] },
              ]}
            />
            <Text
              style={[
                styles.legendText,
                {
                  color:
                    theme.colors.text.secondary,
                },
              ]}
            >
              Mais vendido
            </Text>
          </View>

          <Text
            style={[
              styles.totalText,
              { color: theme.colors.text.primary },
            ]}
          >
            Total:{' '}
            {sortedData.reduce(
              (sum, item) => sum + item.salesCount,
              0
            )}{' '}
            vendas
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 12,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flex: 1,
    paddingHorizontal: 8,
  },
  barColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  barWrapper: {
    alignItems: 'center',
  },
  bar: {
    position: 'relative',
    overflow: 'hidden',
  },
  barInner: {
    position: 'absolute',
    inset: 0,
  },
  barHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  barBase: {
    height: 2,
    borderRadius: 1,
    marginTop: 4,
  },
  valueText: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  labelText: {
    fontSize: 10,
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 60,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 10,
  },
  totalText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
