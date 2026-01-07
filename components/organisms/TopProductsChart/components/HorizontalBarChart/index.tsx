import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProductSales } from '@/services/types';

interface HorizontalBarChartProps {
  data: ProductSales[];
  maxBars?: number;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ 
  data, 
  maxBars = 5 
}) => {
  const sortedData = [...data]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, maxBars);
  
  const maxSales = sortedData[0]?.salesCount || 1;
  
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#EC4899', // Pink
    '#14B8A6', // Teal
  ];

  const formatNumber = (num: number) => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
  };

  return (
    <View style={styles.container}>
      {sortedData.map((item, index) => {
        const percentage = (item.salesCount / maxSales) * 100;
        const color = colors[index % colors.length];
        
        return (
          <View key={item.productId} style={styles.barContainer}>
            <View style={styles.barInfo}>
              <View style={styles.productInfo}>
                <View style={[styles.colorIndicator, { backgroundColor: color }]} />
                <Text style={styles.productName} numberOfLines={1}>
                  {item.productName}
                </Text>
              </View>
              <View style={styles.stats}>
                <Text style={styles.salesCount}>{formatNumber(item.salesCount)}</Text>
                <Text style={styles.revenue}>R$ {item.totalRevenue.toFixed(2)}</Text>
              </View>
            </View>
            
            <View style={styles.barTrack}>
              <View 
                style={[
                  styles.barFill, 
                  { 
                    width: `${percentage}%`,
                    backgroundColor: color,
                  }
                ]} 
              />
              <View style={styles.percentageContainer}>
                <Text style={styles.percentageText}>{percentage.toFixed(0)}%</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  barContainer: {
    marginBottom: 16,
  },
  barInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    flex: 1,
  },
  stats: {
    alignItems: 'flex-end',
  },
  salesCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  revenue: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  barTrack: {
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  percentageContainer: {
    position: 'absolute',
    right: 8,
    top: -2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1E293B',
  },
});