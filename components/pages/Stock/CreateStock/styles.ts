import styled from "styled-components/native";

interface ResponsiveProps {
  isMobile?: boolean;
  isTablet?: boolean;
  isDesktop?: boolean;
  isWeb?: boolean;
}

export const ScreenContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background || '#fff'};
`;

export const Header = styled.View`
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface || '#f8f8f8'};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.secondary || '#e0e0e0'};
`;

export const Label = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary || '#666'};
  margin-bottom: 4px;
`;

export const UnitInfoContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.colors.surface || '#f8f9fa'};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border || '#e0e0e0'};
`;

export const UnitInfoIcon = styled.View`
  margin-right: 12px;
  margin-top: 2px;
`;

export const UnitInfoContent = styled.View`
  flex: 1;
`;

export const UnitInfoTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.feedback.info || '#007AFF'};
  margin-bottom: 4px;
`;

export const UnitInfoText = styled.Text`
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text.secondary || '#666'};
`;

export const ToastNotice = styled.View<ResponsiveProps>`
  flex-direction: row;
  align-items: flex-start;
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 16px;
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