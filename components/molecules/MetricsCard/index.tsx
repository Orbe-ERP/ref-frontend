import React from 'react';
import styled from 'styled-components/native';
import { Feather } from '@expo/vector-icons';

interface MetricsCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
  subtitle?: string;
  trend?: string;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  icon,
  color,
  subtitle,
  trend
}) => {
  return (
    <Container>
      <Header>
        <IconContainer style={{ backgroundColor: `${color}15` }}>
          <Feather name={icon as any} size={20} color={color} />
        </IconContainer>
        {trend && (
          <TrendContainer>
            <TrendText style={{ color }}>
              {trend}
            </TrendText>
          </TrendContainer>
        )}
      </Header>
      
      <Value>{value}</Value>
      <Title>{title}</Title>
      
      {subtitle && (
        <Subtitle>{subtitle}</Subtitle>
      )}
    </Container>
  );
};

const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 16px;
  flex: 1;
  min-width: 45%;
  margin-bottom: 8px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 3px;
  elevation: 2;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const IconContainer = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  justify-content: center;
  align-items: center;
`;

const TrendContainer = styled.View`
  padding: 4px 8px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const TrendText = styled.Text`
  font-size: 12px;
  font-weight: 600;
`;

const Value = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
`;

const Subtitle = styled.Text`
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: 11px;
  font-weight: 400;
`;