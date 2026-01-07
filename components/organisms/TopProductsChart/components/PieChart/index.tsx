import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { ProductSales } from '@/services/types';
import { Category, getCategories, getProductsByCategoryId } from '@/services/category';
import { useAppTheme } from "@/context/ThemeProvider/theme";

interface PieChartProps {
  data: ProductSales[];
  maxItems?: number;
  type?: 'category' | 'price-range' | 'performance';
  restaurantId?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_SIZE = Math.min(SCREEN_WIDTH * 0.35, 180);
const STROKE_WIDTH = 25;
const RADIUS = (CHART_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  maxItems = 5,
  type = 'category',
  restaurantId
}) => {
  const { theme } = useAppTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryProducts, setCategoryProducts] = useState<Map<string, string[]>>(new Map());

  // Carregar categorias
  useEffect(() => {
    if (restaurantId && type === 'category') {
      loadCategories();
    }
  }, [restaurantId, type]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const fetchedCategories = await getCategories(restaurantId);
      setCategories(fetchedCategories.filter(c => c.active !== false));
      
      // Carregar produtos por categoria
      const productMap = new Map<string, string[]>();
      for (const category of fetchedCategories) {
        try {
          const products = await getProductsByCategoryId(category.id);
          productMap.set(category.id, products.map((p: any) => p.id));
        } catch (error) {
          console.warn(`Erro ao carregar produtos da categoria ${category.name}:`, error);
        }
      }
      setCategoryProducts(productMap);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Análise por Categoria REAL
  const getDataByCategory = () => {
    if (categories.length === 0 || categoryProducts.size === 0) {
      return [];
    }

    const categoryMap = new Map<string, { 
      sales: number; 
      revenue: number; 
      productCount: number;
      categoryName: string;
    }>();

    // Inicializar categorias
    categories.forEach(category => {
      categoryMap.set(category.id, { 
        sales: 0, 
        revenue: 0, 
        productCount: 0,
        categoryName: category.name
      });
    });

    // Agrupar vendas por categoria
    data.forEach(item => {
      // Encontrar em qual categoria está este produto
      for (const [categoryId, productIds] of categoryProducts.entries()) {
        if (productIds.includes(item.productId)) {
          const current = categoryMap.get(categoryId)!;
          current.sales += item.salesCount;
          current.revenue += item.totalRevenue;
          current.productCount += 1;
          categoryMap.set(categoryId, current);
          break;
        }
      }
    });

    return Array.from(categoryMap.entries())
      .map(([categoryId, stats]) => ({
        id: categoryId,
        label: stats.categoryName,
        ...stats
      }))
      .filter(item => item.sales > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, maxItems);
  };

  // 2. Análise por Faixa de Preço (com theme)
  const getDataByPriceRange = () => {
    const priceRanges = [
      { 
        label: 'Econômico\n(Até R$ 15)', 
        min: 0, 
        max: 15,
        color: theme.colors.feedback.success // Verde para econômico
      },
      { 
        label: 'Médio\n(R$ 15 - 30)', 
        min: 15, 
        max: 30,
        color: theme.colors.text.accent // Azul para médio
      },
      { 
        label: 'Premium\n(R$ 30 - 50)', 
        min: 30, 
        max: 50,
        color: theme.colors.secondary // Cor secundária
      },
      { 
        label: 'Luxo\n(Acima R$ 50)', 
        min: 50, 
        max: Infinity,
        color: theme.colors.accent // Cor de destaque
      },
    ];
    
    const rangeMap = new Map<string, { 
      sales: number; 
      revenue: number; 
      count: number;
      color: string;
    }>();
    
    // Inicializar ranges
    priceRanges.forEach(range => {
      rangeMap.set(range.label, { 
        sales: 0, 
        revenue: 0, 
        count: 0,
        color: range.color
      });
    });
    
    // Processar cada produto
    data.forEach(item => {
      if (item.salesCount > 0) {
        const avgPrice = item.totalRevenue / item.salesCount;
        const range = priceRanges.find(r => avgPrice >= r.min && avgPrice < r.max);
        
        if (range) {
          const current = rangeMap.get(range.label)!;
          current.sales += item.salesCount;
          current.revenue += item.totalRevenue;
          current.count += 1;
          rangeMap.set(range.label, current);
        }
      }
    });
    
    return Array.from(rangeMap.entries())
      .map(([label, stats]) => ({
        label,
        ...stats
      }))
      .filter(item => item.sales > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, maxItems);
  };

  // 3. Análise por Performance (com theme)
  const getDataByPerformance = () => {
    if (data.length === 0) return [];
    
    const sorted = [...data].sort((a, b) => b.salesCount - a.salesCount);
    const topCount = Math.max(1, Math.floor(sorted.length * 0.2));
    
    const topProducts = sorted.slice(0, topCount);
    const middleProducts = sorted.slice(topCount, -topCount);
    const bottomProducts = sorted.slice(-topCount);
    
    const groups = [];
    
    if (topProducts.length > 0) {
      groups.push({
        label: 'Top Performers',
        description: `Top ${topCount} produtos`,
        sales: topProducts.reduce((sum, item) => sum + item.salesCount, 0),
        revenue: topProducts.reduce((sum, item) => sum + item.totalRevenue, 0),
        count: topProducts.length,
        color: theme.colors.feedback.success // Verde para sucesso
      });
    }
    
    if (middleProducts.length > 0) {
      groups.push({
        label: 'Intermediários',
        description: 'Produtos do meio',
        sales: middleProducts.reduce((sum, item) => sum + item.salesCount, 0),
        revenue: middleProducts.reduce((sum, item) => sum + item.totalRevenue, 0),
        count: middleProducts.length,
        color: theme.colors.feedback.warning // Amarelo para atenção
      });
    }
    
    if (bottomProducts.length > 0) {
      groups.push({
        label: 'Baixa Rotação',
        description: `Últimos ${bottomProducts.length}`,
        sales: bottomProducts.reduce((sum, item) => sum + item.salesCount, 0),
        revenue: bottomProducts.reduce((sum, item) => sum + item.totalRevenue, 0),
        count: bottomProducts.length,
        color: theme.colors.feedback.error // Vermelho para alerta
      });
    }
    
    return groups.filter(item => item.sales > 0);
  };

  // Selecionar os dados baseado no tipo
  let chartData: any[] = [];
  let totalValue = 0;
  let chartTitle = '';
  let valueLabel = 'vendas';

  switch (type) {
    case 'category':
      chartData = getDataByCategory();
      totalValue = chartData.reduce((sum, item) => sum + item.revenue, 0);
      chartTitle = 'Receita por Categoria';
      valueLabel = 'receita';
      break;
      
    case 'price-range':
      chartData = getDataByPriceRange();
      totalValue = chartData.reduce((sum, item) => sum + item.revenue, 0);
      chartTitle = 'Vendas por Faixa de Preço';
      valueLabel = 'receita';
      break;
      
    case 'performance':
      chartData = getDataByPerformance();
      totalValue = chartData.reduce((sum, item) => sum + item.revenue, 0);
      chartTitle = 'Performance dos Produtos';
      valueLabel = 'receita';
      break;
      
    default:
      chartData = getDataByCategory();
      totalValue = chartData.reduce((sum, item) => sum + item.revenue, 0);
      chartTitle = 'Receita por Categoria';
      valueLabel = 'receita';
  }

  // Se estiver carregando categorias
  if (loading && type === 'category') {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
            Carregando categorias...
          </Text>
        </View>
      </View>
    );
  }

  if (chartData.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.placeholderChart, { backgroundColor: theme.colors.background }]} />
        <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
          Sem dados para exibir
        </Text>
        <Text style={[styles.emptySubtext, { color: theme.colors.text.muted }]}>
          {type === 'category' ? 'Configure categorias no sistema' : 'Complete vendas para ver a análise'}
        </Text>
      </View>
    );
  }

  // Preparar dados para o gráfico
  let accumulatedAngle = 0;
  const segments = chartData.map((item, index) => {
    const value = item.revenue;
    const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;
    const strokeDasharray = `${(percentage / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`;
    
    return {
      ...item,
      value,
      percentage,
      strokeDasharray,
      color: item.color || getSegmentColor(index, type, theme),
      angle: accumulatedAngle,
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.chartTitle, { color: theme.colors.text.primary }]}>
        {chartTitle}
      </Text>
      
      <View style={styles.chartWithLegend}>
        <View style={styles.chartWrapper}>
          <Svg width={CHART_SIZE} height={CHART_SIZE}>
            <G rotation="-90" origin={`${CHART_SIZE / 2}, ${CHART_SIZE / 2}`}>
              {segments.map((segment, index) => (
                <Circle
                  key={index}
                  cx={CHART_SIZE / 2}
                  cy={CHART_SIZE / 2}
                  r={RADIUS}
                  stroke={segment.color}
                  strokeWidth={STROKE_WIDTH}
                  strokeDasharray={segment.strokeDasharray}
                  strokeLinecap="round"
                  fill="transparent"
                />
              ))}
            </G>
          </Svg>
          
          <View style={styles.centerLabel}>
            <Text style={[styles.totalValue, { color: theme.colors.text.primary }]}>
              R$ {totalValue.toFixed(0)}
            </Text>
            <Text style={[styles.totalLabel, { color: theme.colors.text.muted }]}>
              {valueLabel}
            </Text>
          </View>
        </View>
        
        <View style={styles.legend}>
          {segments.map((segment, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={styles.legendItemLeft}>
                <View 
                  style={[
                    styles.legendColor, 
                    { backgroundColor: segment.color }
                  ]} 
                />
                <View style={styles.legendTextContainer}>
                  <Text 
                    style={[styles.legendTitle, { color: theme.colors.text.primary }]} 
                    numberOfLines={2}
                  >
                    {segment.label}
                  </Text>
                  {segment.description && (
                    <Text style={[styles.legendDescription, { color: theme.colors.text.muted }]}>
                      {segment.description}
                    </Text>
                  )}
                  {segment.productCount > 0 && (
                    <Text style={[styles.productCount, { color: theme.colors.text.muted }]}>
                      {segment.productCount} {segment.productCount === 1 ? 'produto' : 'produtos'}
                    </Text>
                  )}
                </View>
              </View>
              
              <View style={styles.legendRight}>
                <Text style={[styles.legendValue, { color: theme.colors.text.primary }]}>
                  R$ {segment.revenue.toFixed(0)}
                </Text>
                <Text style={[styles.legendPercentage, { color: theme.colors.text.muted }]}>
                  {segment.percentage.toFixed(0)}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const getSegmentColor = (index: number, type: string, theme: any): string => {
  const colors = [
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.accent,
    theme.colors.feedback.info,
    theme.colors.feedback.warning,
    theme.colors.feedback.error,
  ];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    minHeight: 200,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartWithLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  legend: {
    flex: 1,
    marginLeft: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 6,
  },
  legendItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  legendTextContainer: {
    flex: 1,
  },
  legendTitle: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
    lineHeight: 16,
  },
  legendDescription: {
    fontSize: 10,
    marginBottom: 2,
  },
  productCount: {
    fontSize: 9,
  },
  legendRight: {
    alignItems: 'flex-end',
  },
  legendValue: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  legendPercentage: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
    minHeight: 200,
    borderRadius: 12,
  },
  placeholderChart: {
    width: CHART_SIZE,
    height: CHART_SIZE,
    borderRadius: CHART_SIZE / 2,
    marginBottom: 16,
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