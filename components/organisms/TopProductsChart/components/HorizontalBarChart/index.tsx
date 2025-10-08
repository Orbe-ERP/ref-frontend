import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ProductSales } from '@/services/types';

interface HorizontalBarChartProps {
  data: ProductSales[];
  maxBars?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ 
  data, 
  maxBars = 5 
}) => {
  const sortedData = [...data]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, maxBars);

  const maxSales = Math.max(...sortedData.map(item => item.salesCount), 1);

  return (
    <View style={styles.container}>
      {sortedData.map((item, index) => (
        <View key={item.productId} style={styles.barContainer}>
          <View style={styles.barInfo}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.productName}
            </Text>
            <Text style={styles.salesCount}>{item.salesCount}</Text>
          </View>
          <View style={styles.barBackground}>
            <View 
              style={[
                styles.barFill,
                { 
                  width: `${(item.salesCount / maxSales) * 80}%`,
                  backgroundColor: getBarColor(index)
                }
              ]} 
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const getBarColor = (index: number): string => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  barContainer: {
    marginBottom: 12,
  },
  barInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  productName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  salesCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  barBackground: {
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 10,
  },
});