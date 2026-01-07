import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { ProductSales } from '@/services/types';
import { useAppTheme } from '@/context/ThemeProvider/theme';

interface PieChartProfitProps {
  data: ProductSales[];
  maxItems?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_SIZE = Math.min(SCREEN_WIDTH * 0.3, 140);
const STROKE_WIDTH = 20;

export const PieChartProfit: React.FC<PieChartProfitProps> = ({ data, maxItems = 4 }) => {
  const { theme } = useAppTheme();
  const [viewMode, setViewMode] = useState<'margin' | 'volume' | 'value'>('margin');

  // Função auxiliar para detectar produtos em promoção baseado no nome
  const isPromotionalProduct = (productName: string): boolean => {
    const promotionalKeywords = ['promo', 'combo', 'oferta', 'especial', 'menu', 'kit'];
    const lowerName = productName.toLowerCase();
    return promotionalKeywords.some(keyword => lowerName.includes(keyword));
  };

  // Análise por Margem de Contribuição (estimada baseada no preço)
  const getMarginAnalysis = () => {
    const groups = [
      { 
        label: 'Alta Margem', 
        description: 'Produtos Premium',
        condition: (avgPrice: number) => avgPrice > 40
      },
      { 
        label: 'Média Margem', 
        description: 'Produtos Regulares',
        condition: (avgPrice: number) => avgPrice >= 20 && avgPrice <= 40
      },
      { 
        label: 'Baixa Margem', 
        description: 'Produtos Econômicos',
        condition: (avgPrice: number) => avgPrice < 20 && avgPrice > 0
      },
      { 
        label: 'Promoções', 
        description: 'Itens em Oferta',
        isPromotional: true
      }
    ];

    const results = groups.map((group, index) => ({
      label: group.label,
      description: group.description,
      sales: 0,
      revenue: 0,
      productIds: new Set<string>(),
      color: getGroupColor(index, 'margin', theme)
    }));

    // Processar cada produto
    data.forEach(item => {
      const avgPrice = item.salesCount > 0 ? item.totalRevenue / item.salesCount : 0;
      
      // Verificar se é produto promocional
      if (isPromotionalProduct(item.productName)) {
        const promoGroup = results[3];
        promoGroup.sales += item.salesCount;
        promoGroup.revenue += item.totalRevenue;
        promoGroup.productIds.add(item.productId);
        return;
      }

      // Para outros grupos, usar condição de preço
      for (let i = 0; i < 3; i++) {
        const group = groups[i];
        if (group.condition && group.condition(avgPrice)) {
          results[i].sales += item.salesCount;
          results[i].revenue += item.totalRevenue;
          results[i].productIds.add(item.productId);
          break;
        }
      }
    });

    // Converter Set para contagem e filtrar grupos vazios
    return results
      .map(r => ({
        ...r,
        productCount: r.productIds.size
      }))
      .filter(r => r.sales > 0)
      .slice(0, maxItems);
  };

  // Análise por Volume de Vendas (Pareto)
  const getVolumeAnalysis = () => {
    if (data.length === 0) return [];
    
    const sorted = [...data].sort((a, b) => b.salesCount - a.salesCount);
    const totalSales = sorted.reduce((sum, item) => sum + item.salesCount, 0);
    
    // Aplicar regra de Pareto (80/20)
    let accumulatedSales = 0;
    const threshold80 = totalSales * 0.8;
    const threshold95 = totalSales * 0.95;
    
    const results = [
      { 
        label: 'Top 20%', 
        description: 'Principais Vendedores',
        sales: 0,
        revenue: 0,
        productIds: new Set<string>(),
        color: theme.colors.feedback.success
      },
      { 
        label: 'Próximos 15%', 
        description: 'Vendedores Intermediários',
        sales: 0,
        revenue: 0,
        productIds: new Set<string>(),
        color: theme.colors.feedback.warning
      },
      { 
        label: 'Restante 65%', 
        description: 'Demais Produtos',
        sales: 0,
        revenue: 0,
        productIds: new Set<string>(),
        color: theme.colors.feedback.error
      }
    ];
    
    let currentGroup = 0;
    
    sorted.forEach(item => {
      if (currentGroup === 0 && accumulatedSales < threshold80) {
        results[0].sales += item.salesCount;
        results[0].revenue += item.totalRevenue;
        results[0].productIds.add(item.productId);
        accumulatedSales += item.salesCount;
      } else if (currentGroup === 1 && accumulatedSales < threshold95) {
        results[1].sales += item.salesCount;
        results[1].revenue += item.totalRevenue;
        results[1].productIds.add(item.productId);
        accumulatedSales += item.salesCount;
      } else {
        if (currentGroup < 2) currentGroup = 2;
        results[2].sales += item.salesCount;
        results[2].revenue += item.totalRevenue;
        results[2].productIds.add(item.productId);
      }
    });
    
    return results
      .map(r => ({
        ...r,
        productCount: r.productIds.size
      }))
      .filter(r => r.sales > 0);
  };

  // Análise por Valor (Receita - Pareto 80/20)
  const getValueAnalysis = () => {
    if (data.length === 0) return [];
    
    const sorted = [...data].sort((a, b) => b.totalRevenue - a.totalRevenue);
    const totalRevenue = sorted.reduce((sum, item) => sum + item.totalRevenue, 0);
    
    // Regra 80/20
    const targetRevenue = totalRevenue * 0.8;
    let accumulatedRevenue = 0;
    
    const results = [
      { 
        label: 'Top 20%', 
        description: '80% da Receita',
        revenue: 0,
        sales: 0,
        productIds: new Set<string>(),
        color: theme.colors.primary
      },
      { 
        label: 'Restante 80%', 
        description: '20% da Receita',
        revenue: 0,
        sales: 0,
        productIds: new Set<string>(),
        color: theme.colors.secondary
      }
    ];
    
    for (const item of sorted) {
      if (accumulatedRevenue < targetRevenue) {
        results[0].revenue += item.totalRevenue;
        results[0].sales += item.salesCount;
        results[0].productIds.add(item.productId);
        accumulatedRevenue += item.totalRevenue;
      } else {
        results[1].revenue += item.totalRevenue;
        results[1].sales += item.salesCount;
        results[1].productIds.add(item.productId);
      }
    }
    
    return results
      .map(r => ({
        ...r,
        productCount: r.productIds.size
      }))
      .filter(r => r.revenue > 0);
  };

  // Obter dados baseado no modo
  const getChartData = () => {
    switch (viewMode) {
      case 'margin': return getMarginAnalysis();
      case 'volume': return getVolumeAnalysis();
      case 'value': return getValueAnalysis();
      default: return getMarginAnalysis();
    }
  };

  const chartData = getChartData();
  const totalValue = chartData.reduce((sum, item) => 
    sum + (viewMode === 'value' ? item.revenue : item.sales), 0
  );

  if (chartData.length === 0 || totalValue === 0) {
    return (
      <View style={[styles.container, { 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border 
      }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
            Dados insuficientes
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.text.muted }]}>
            Realize mais vendas para análise
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { 
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border 
    }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          {viewMode === 'margin' ? 'Análise de Margem' : 
           viewMode === 'volume' ? 'Análise de Volume' : 
           'Análise 80/20'}
        </Text>
        
        <View style={[styles.modeSelector, { backgroundColor: theme.colors.background }]}>
          {['margin', 'volume', 'value'].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.modeButton, 
                viewMode === mode && [
                  styles.modeButtonActive, 
                  { backgroundColor: theme.colors.surface }
                ]
              ]}
              onPress={() => setViewMode(mode as any)}
            >
              <Text style={[
                styles.modeText, 
                { color: theme.colors.text.secondary },
                viewMode === mode && [
                  styles.modeTextActive, 
                  { color: theme.colors.primary }
                ]
              ]}>
                {mode === 'margin' ? 'Margem' : 
                 mode === 'volume' ? 'Volume' : 'Valor'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.chartContent}>
        <View style={styles.pieContainer}>
          <Svg width={CHART_SIZE} height={CHART_SIZE}>
            <G rotation="-90" origin={`${CHART_SIZE / 2}, ${CHART_SIZE / 2}`}>
              {chartData.map((item, index) => {
                const value = viewMode === 'value' ? item.revenue : item.sales;
                const percentage = (value / totalValue) * 100;
                const circumference = 2 * Math.PI * (CHART_SIZE / 2 - STROKE_WIDTH / 2);
                const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                
                return (
                  <Circle
                    key={index}
                    cx={CHART_SIZE / 2}
                    cy={CHART_SIZE / 2}
                    r={CHART_SIZE / 2 - STROKE_WIDTH / 2}
                    stroke={item.color}
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={strokeDasharray}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                );
              })}
            </G>
          </Svg>
          
          <View style={styles.pieCenter}>
            <Text style={[styles.centerValue, { color: theme.colors.text.primary }]}>
              {viewMode === 'value' 
                ? `R$ ${totalValue.toFixed(0)}`
                : totalValue.toFixed(0)}
            </Text>
            <Text style={[styles.centerLabel, { color: theme.colors.text.muted }]}>
              {viewMode === 'value' ? 'receita' : 'vendas'}
            </Text>
          </View>
        </View>

        <View style={styles.legend}>
          {chartData.map((item, index) => {
            const value = viewMode === 'value' ? item.revenue : item.sales;
            const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;
            
            return (
              <View key={index} style={styles.legendRow}>
                <View style={styles.legendLeft}>
                  <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                  <View style={styles.legendTextContainer}>
                    <Text 
                      style={[styles.legendTitle, { color: theme.colors.text.primary }]} 
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                    {item.description && (
                      <Text 
                        style={[styles.legendSubtitle, { color: theme.colors.text.muted }]} 
                        numberOfLines={1}
                      >
                        {item.description}
                      </Text>
                    )}
                    {item.productCount > 0 && (
                      <Text style={[styles.productCount, { color: theme.colors.text.muted }]}>
                        {item.productCount} {item.productCount === 1 ? 'produto' : 'produtos'}
                      </Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.legendRight}>
                  <Text style={[styles.legendValue, { color: theme.colors.text.primary }]}>
                    {viewMode === 'value' 
                      ? `R$ ${value.toFixed(0)}`
                      : value.toFixed(0)}
                  </Text>
                  <Text style={[styles.legendPercentage, { color: theme.colors.text.muted }]}>
                    {percentage.toFixed(0)}%
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const getGroupColor = (index: number, type: string, theme: any): string => {
  switch (type) {
    case 'margin':
      const marginColors = [
        theme.colors.feedback.success, // Alta margem - verde
        theme.colors.feedback.warning, // Média margem - amarelo
        theme.colors.feedback.error,   // Baixa margem - vermelho
        theme.colors.accent,           // Promoções - cor de destaque
      ];
      return marginColors[index % marginColors.length];
      
    case 'volume':
      const volumeColors = [
        theme.colors.primary,     // Top 20% - cor principal
        theme.colors.secondary,   // Próximos 15% - cor secundária
        theme.colors.accent,      // Restante - cor de destaque
      ];
      return volumeColors[index % volumeColors.length];
      
    default:
      return theme.colors.primary;
  }
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  modeSelector: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  modeButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  modeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  modeTextActive: {
    fontWeight: '600',
  },
  chartContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pieContainer: {
    position: 'relative',
    width: CHART_SIZE,
    height: CHART_SIZE,
  },
  pieCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  centerLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  legend: {
    flex: 1,
    marginLeft: 16,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 6,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
    marginTop: 4,
  },
  legendTextContainer: {
    flex: 1,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  legendSubtitle: {
    fontSize: 10,
    marginBottom: 2,
  },
  productCount: {
    fontSize: 9,
  },
  legendRight: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  legendValue: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  legendPercentage: {
    fontSize: 11,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
    minHeight: 200,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
  },
});