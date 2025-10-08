import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { ProductSales } from '@/services/types';

interface PieChartProps {
  data: ProductSales[];
  maxItems?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_SIZE = SCREEN_WIDTH * 0.4;
const STROKE_WIDTH = 30;
const RADIUS = (CHART_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const PieChart: React.FC<PieChartProps> = ({ data, maxItems = 5 }) => {
  const filteredData = data
    .filter(item => item.salesCount > 0)
    .slice(0, maxItems);

  const totalSales = filteredData.reduce((sum, item) => sum + item.salesCount, 0);

  if (filteredData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Sem vendas no período</Text>
      </View>
    );
  }

  let accumulatedAngle = 0;
  const chartData = filteredData.map((item, index) => {
    const percentage = (item.salesCount / totalSales) * 100;
    const strokeDasharray = `${(percentage / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`;
    
    const segment = {
      ...item,
      percentage,
      strokeDasharray,
      color: getSegmentColor(index),
      angle: accumulatedAngle
    };
    
    accumulatedAngle += (percentage / 100) * 360;
    return segment;
  });

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg width={CHART_SIZE} height={CHART_SIZE}>
          <G rotation="-90" origin={`${CHART_SIZE / 2}, ${CHART_SIZE / 2}`}>
            {chartData.map((segment, index) => (
              <Circle
                key={segment.productId}
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
          <Text style={styles.totalSales}>{totalSales}</Text>
          <Text style={styles.totalLabel}>vendas</Text>
        </View>
      </View>
      
      <View style={styles.legend}>
        {chartData.map((segment, index) => (
          <View key={segment.productId} style={styles.legendItem}>
            <View 
              style={[
                styles.legendColor, 
                { backgroundColor: segment.color }
              ]} 
            />
            <Text style={styles.legendText} numberOfLines={1}>
              {segment.productName}
            </Text>
            <Text style={styles.legendPercentage}>
              {segment.percentage.toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const getSegmentColor = (index: number): string => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  chartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    position: 'absolute',
    alignItems: 'center',
  },
  totalSales: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalLabel: {
    fontSize: 12,
    color: '#666',
  },
  legend: {
    flex: 1,
    marginLeft: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: 12,
    marginRight: 8,
  },
  legendPercentage: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
  },
});