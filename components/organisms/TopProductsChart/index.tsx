import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { HorizontalBarChart } from './components/HorizontalBarChart';
import { PieChart } from './components/PieChart';
import { SalesService } from '@/services/salesService';
import { getOrdersByRestaurant } from '@/services/order';
import { SalesTimeRange, ChartType } from '@/services/types';
import useRestaurant from '@/hooks/useRestaurant';

interface TopProductsChartProps {
  restaurantId?: string;
  variant?: 'full' | 'mini'; // 'full' para dashboard, 'mini' para index
  defaultChartType?: ChartType; // Tipo de gráfico padrão
  showFilters?: boolean; // Mostrar filtros de tempo
  showInsights?: boolean; // Mostrar insights
  showRefreshButton?: boolean; // Mostrar botão atualizar
}

export const TopProductsChart: React.FC<TopProductsChartProps> = ({ 
  restaurantId: propRestaurantId,
  variant = 'full', // Default para versão completa
  defaultChartType = 'bar',
  showFilters = true,
  showInsights = true,
  showRefreshButton = true
}) => {
  // Pega restaurantId dos params, da prop ou do hook
  const params = useLocalSearchParams();
  const { selectedRestaurant } = useRestaurant();
  const restaurantId = propRestaurantId || params.restaurantId as string || selectedRestaurant?.id;
  
  const [salesData, setSalesData] = useState<SalesTimeRange | null>(null);
  const [selectedRange, setSelectedRange] = useState<keyof SalesTimeRange>('day');
  const [chartType, setChartType] = useState<ChartType>(defaultChartType);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const timeRanges = SalesService.getTimeRanges();

  useEffect(() => {
    if (restaurantId) {
      loadSalesData();
    } else {
      setLoading(false);
    }
  }, [restaurantId]);

  const loadSalesData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      if (!restaurantId) {
        setError("Nenhum restaurante selecionado");
        return;
      }

      // Busca pedidos concluídos
      const orders = await getOrdersByRestaurant(restaurantId, 'COMPLETED');
      const salesData = SalesService.getSalesByTimeRange(orders);
      setSalesData(salesData);
    } catch (error) {
      console.error('Erro ao carregar dados de vendas:', error);
      setError('Erro ao carregar dados de vendas');
    } finally {
      setLoading(false);
    }
  };

  const currentData = salesData?.[selectedRange] || [];
  const topProduct = currentData[0];

  // Para versão mini, sempre mostrar apenas dados do dia
  const displayData = variant === 'mini' ? (salesData?.day || []) : currentData;

  if (!restaurantId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Selecione um restaurante para ver as vendas</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#45B7D1" />
        <Text style={styles.loadingText}>Carregando dados de vendas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadSalesData}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      variant === 'mini' && styles.miniContainer
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {variant === 'mini' ? '📊 Pratos Mais Vendidos Hoje' : '🍽️ Pratos Mais Vendidos'}
        </Text>
        
        {/* Seletor de tipo de gráfico - apenas na versão full */}
        {variant === 'full' && (
          <View style={styles.chartTypeSelector}>
            <TouchableOpacity
              style={[styles.chartTypeButton, chartType === 'bar' && styles.chartTypeButtonActive]}
              onPress={() => setChartType('bar')}
            >
              <Text style={[styles.chartTypeText, chartType === 'bar' && styles.chartTypeTextActive]}>
                Barras
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chartTypeButton, chartType === 'pie' && styles.chartTypeButtonActive]}
              onPress={() => setChartType('pie')}
            >
              <Text style={[styles.chartTypeText, chartType === 'pie' && styles.chartTypeTextActive]}>
                Pizza
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Filtro de Tempo - apenas na versão full */}
      {showFilters && variant === 'full' && (
        <View style={styles.timeFilter}>
          {timeRanges.map((range) => (
            <TouchableOpacity
              key={range.value}
              style={[
                styles.timeFilterButton,
                selectedRange === range.value && styles.timeFilterButtonActive
              ]}
              onPress={() => setSelectedRange(range.value)}
            >
              <Text style={[
                styles.timeFilterText,
                selectedRange === range.value && styles.timeFilterTextActive
              ]}>
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Insight do Produto Top */}
      {showInsights && topProduct && (
        <View style={styles.insightContainer}>
          <Text style={styles.insightTitle}>💡 {variant === 'mini' ? 'Destaque do Dia' : 'Insight'}</Text>
          <Text style={styles.insightText}>
            <Text style={styles.highlight}>{topProduct.productName}</Text> é o campeão com {topProduct.salesCount} vendas
            {variant === 'full' && topProduct.salesCount > 10 ? ' - Considere aumentar o estoque!' : ''}
          </Text>
        </View>
      )}

      {/* Gráfico */}
      <View style={styles.chartContainer}>
        {displayData.length > 0 ? (
          // Na versão mini, sempre mostra barras; na full, mostra o selecionado
          variant === 'mini' ? (
            <HorizontalBarChart data={displayData} maxBars={5} />
          ) : chartType === 'bar' ? (
            <HorizontalBarChart data={displayData} maxBars={5} />
          ) : (
            <PieChart data={displayData} maxItems={5} />
          )
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {variant === 'mini' ? 'Nenhuma venda hoje' : 'Nenhuma venda no período selecionado'}
            </Text>
          </View>
        )}
      </View>

      {/* Botão de Atualizar - opcional */}
      {showRefreshButton && (
        <TouchableOpacity style={styles.refreshButton} onPress={loadSalesData}>
          <Text style={styles.refreshButtonText}>🔄 Atualizar Dados</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
   container: {
    backgroundColor: '#041224',
    borderRadius: 12,
    border: '1px solid #fff',
    padding: 16,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  miniContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  chartTypeSelector: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 2,
  },
  chartTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  chartTypeButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chartTypeText: {
    fontSize: 12,
    color: '#666',
  },
  chartTypeTextActive: {
    color: '#333',
    fontWeight: '500',
  },
  timeFilter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 6,
  },
  timeFilterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  timeFilterButtonActive: {
    backgroundColor: '#45B7D1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeFilterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  timeFilterTextActive: {
    color: '#041224',
  },
  insightContainer: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 12,
    color: '#424242',
    lineHeight: 16,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  chartContainer: {
    minHeight: 200,
  },
  refreshButton: {
    backgroundColor: '#45B7D1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  refreshButtonText: {
    color: '#041224',
    fontWeight: 'semibold',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    margin: 10,
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
  },
})