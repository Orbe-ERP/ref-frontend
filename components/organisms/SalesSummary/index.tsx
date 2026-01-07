import React, { useState } from 'react';
import styled from 'styled-components/native';
import { SalesTimeRange } from '@/services/types';
import { Feather } from '@expo/vector-icons';

interface SalesSummaryProps {
  salesData: SalesTimeRange | null;
}

export const SalesSummary: React.FC<SalesSummaryProps> = ({ salesData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');
  
  const periods = [
    { key: 'day', label: 'Hoje', icon: 'sun' },
    { key: 'week', label: 'Esta Semana', icon: 'calendar' },
    { key: 'month', label: 'Este Mês', icon: 'bar-chart-2' },
  ];
  
  const calculatePeriodData = (period: 'day' | 'week' | 'month') => {
    const data = salesData?.[period] || [];
    const totalSales = data.reduce((sum, item) => sum + item.salesCount, 0);
    const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
    const topProduct = data.sort((a, b) => b.salesCount - a.salesCount)[0];
    
    return {
      totalSales,
      totalRevenue,
      topProduct: topProduct?.productName || 'Nenhum',
      topSales: topProduct?.salesCount || 0,
      productCount: data.length,
    };
  };
  
  const periodData = calculatePeriodData(selectedPeriod);
  
  return (
    <Container>
      <SectionTitle>
        <Feather name="pie-chart" size={18} color="#666" />
        <SectionTitleText>Resumo de Vendas</SectionTitleText>
      </SectionTitle>
      
      <PeriodSelector>
        {periods.map((period) => (
          <PeriodButton
            key={period.key}
            active={selectedPeriod === period.key}
            onPress={() => setSelectedPeriod(period.key as any)}
          >
            <PeriodIcon name={period.icon} active={selectedPeriod === period.key} />
            <PeriodButtonText active={selectedPeriod === period.key}>
              {period.label}
            </PeriodButtonText>
          </PeriodButton>
        ))}
      </PeriodSelector>
      
      <MetricsGrid>
        <MetricItem>
          <MetricLabel>Total Vendido</MetricLabel>
          <MetricValue>R$ {periodData.totalRevenue.toFixed(2)}</MetricValue>
        </MetricItem>
        
        <MetricItem>
          <MetricLabel>Itens Vendidos</MetricLabel>
          <MetricValue>{periodData.totalSales}</MetricValue>
        </MetricItem>
        
        <MetricItem>
          <MetricLabel>Produto Top</MetricLabel>
          <MetricValue>{periodData.topProduct}</MetricValue>
          <MetricSubtitle>{periodData.topSales} unidades</MetricSubtitle>
        </MetricItem>
        
        <MetricItem>
          <MetricLabel>Produtos Únicos</MetricLabel>
          <MetricValue>{periodData.productCount}</MetricValue>
        </MetricItem>
      </MetricsGrid>
    </Container>
  );
};

const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  margin: 16px;
  border-radius: 16px;
  padding: 20px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.05;
  shadow-radius: 8px;
  elevation: 3;
`;

const SectionTitle = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitleText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 18px;
  font-weight: 600;
  margin-left: 8px;
`;

const PeriodSelector = styled.View`
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 20px;
`;

const PeriodButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px 8px;
  border-radius: 8px;
  background-color: ${({ active, theme }) => 
    active ? theme.colors.primary : 'transparent'};
`;

const PeriodIcon = styled(Feather)<{ active: boolean }>`
  font-size: 14px;
  margin-right: 6px;
  color: ${({ active, theme }) => 
    active ? '#FFFFFF' : theme.colors.text.secondary};
`;

const PeriodButtonText = styled.Text<{ active: boolean }>`
  font-size: 13px;
  font-weight: 500;
  color: ${({ active, theme }) => 
    active ? '#FFFFFF' : theme.colors.text.secondary};
`;

const MetricsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
`;

const MetricItem = styled.View`
  flex: 1;
  min-width: 45%;
  margin-bottom: 8px;
`;

const MetricLabel = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetricValue = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 18px;
  font-weight: 600;
`;

const MetricSubtitle = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  margin-top: 2px;
`;