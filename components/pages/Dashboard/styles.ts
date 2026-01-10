import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";

export interface ResponsiveProps {
  isMobile?: boolean;
  isTablet?: boolean;
  isDesktop?: boolean;
  isWeb?: boolean;
}

export const ScreenContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const ScrollView = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

export const LoadingText = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
  margin-top: 12px;
`;

export const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  padding: 20px;
`;

export const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.feedback.error};
  font-size: 16px;
  margin-top: 16px;
  text-align: center;
`;

export const RetryButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 12px 24px;
  border-radius: 8px;
  margin-top: 20px;
`;

export const RetryButtonText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 14px;
`;

export const RestaurantHeader = styled.View`
  padding: 20px 16px 12px;
`;

export const RestaurantName = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
`;

export const RestaurantSubtitle = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
  font-weight: 400;
`;

export const MetricsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 16px;
  margin-top: 8px;
  gap: 12px;
`;

export const SectionTitle = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 18px;
  font-weight: 600;
  margin: 24px 16px 12px;
`;

export const InsightsSection = styled.View`
  margin-top: 20px;
`;

export const InsightsCard = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  margin: 0 16px;
  border-radius: 12px;
  padding: 16px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const InsightItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

export const InsightIcon = styled(Feather)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 16px;
  margin-right: 12px;
`;

export const InsightText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 14px;
  flex: 1;
`;

export const InsightHighlight = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

export const Icon = styled(Feather as any)<{ color?: string }>`
  color: ${({ color, theme }) => color || theme.colors.primary};
`;

export const ToastNotice = styled.View<ResponsiveProps>`
  flex-direction: row;
  align-items: flex-start;
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 16px;
  margin-horizontal: 16px;
  margin-vertical: 12px;
  background-color: ${({ theme }) => theme.colors.surface};
  
  ${({ isTablet, isDesktop }) => 
    (isTablet || isDesktop) ? `
    width: 100%;
  ` : ''}
`;

export const ToastIcon = styled.View`
  margin-right: 12px;
  margin-top: 2px;
`;

export const ToastContent = styled.View`
  flex: 1;
`;

export const ToastTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.feedback.warning};
`;

export const ToastText = styled.Text`
  font-size: 13px;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.feedback.warning};
`;

export const ToastStrong = styled.Text`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;
