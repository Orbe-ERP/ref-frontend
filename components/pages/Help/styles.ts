import styled from "styled-components/native";

interface ResponsiveProps {
  isMobile?: boolean;
  isTablet?: boolean;
  isDesktop?: boolean;
  isWeb?: boolean;
}

export const Container = styled.View<ResponsiveProps>`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
  
  ${({ isWeb, isTablet, isDesktop }) => 
    (isTablet || isDesktop) && isWeb ? `
    align-items: center;
  ` : ''}
`;

export const ContentWrapper = styled.View<ResponsiveProps>`
  ${({ isTablet, isDesktop }) => 
    (isTablet || isDesktop) ? `
    max-width: 600px;
    width: 100%;
    align-self: center;
  ` : ''}
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

export const Card = styled.View<ResponsiveProps>`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 16px;
  border-radius: 16px;
  gap: 12px;
  
  ${({ isTablet, isDesktop }) => 
    (isTablet || isDesktop) ? `
    width: 100%;
  ` : ''}
`;

export const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const CardTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const CardText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 20px;
`;

export const Email = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;
`;