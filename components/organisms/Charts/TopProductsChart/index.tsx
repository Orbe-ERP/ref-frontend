import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/context/ThemeProvider/theme';
import { ReportData } from '@/services/order';
interface TopProductsChartProps {
  orders: ReportData[];
  selectedPeriod: 'day' | 'week' | 'month';
  maxItems?: number;
}

export const TopProductsChart: React.FC<TopProductsChartProps> = ({
  orders,
  selectedPeriod,
  maxItems = 5
}) => {
  const { theme } = useAppTheme();
  
  // Filtra ordens pelo período selecionado
  const filteredOrders = filterOrdersByPeriod(orders, selectedPeriod);
  
  // Agrupa produtos vendidos
  const productMap = new Map<string, {
    name: string;
    quantity: number;
    revenue: number;
  }>();

  filteredOrders.forEach(order => {
    order.products.forEach(product => {
      const current = productMap.get(product.productId) || {
        name: product.productName,
        quantity: 0,
        revenue: 0
      };
      
      current.quantity += product.quantity;
      current.revenue += product.price * product.quantity;
      
      productMap.set(product.productId, current);
    });
  });

  // Converte para array e ordena
  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, maxItems);

  if (topProducts.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
          Nenhum produto vendido no período
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        Top {maxItems} Produtos
      </Text>
      
      <View style={styles.productsList}>
        {topProducts.map((product, index) => (
          <View key={index} style={styles.productItem}>
            <View style={styles.productLeft}>
              <View style={[styles.rankBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: theme.colors.text.primary }]}>
                  {product.name}
                </Text>
                <Text style={[styles.productDetails, { color: theme.colors.text.secondary }]}>
                  {product.quantity} unidades
                </Text>
              </View>
            </View>
            <Text style={[styles.productRevenue, { color: theme.colors.text.primary }]}>
              R$ {product.revenue.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Função auxiliar para filtrar por período
const filterOrdersByPeriod = (orders: ReportData[], period: 'day' | 'week' | 'month') => {
  const now = new Date();
  
  switch (period) {
    case 'day':
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      return orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startOfDay && orderDate <= endOfDay;
      });
      
    case 'week':
      const dayOfWeek = now.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() + diffToMonday);
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      return orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startOfWeek && orderDate <= endOfWeek;
      });
      
    case 'month':
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      return orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startOfMonth && orderDate <= endOfMonth;
      });
      
    default:
      return orders;
  }
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  productsList: {
    marginTop: 8,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  productLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  productDetails: {
    fontSize: 12,
  },
  productRevenue: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
});