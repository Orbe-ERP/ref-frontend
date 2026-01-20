import styled from "styled-components/native";

interface ResponsiveProps {
  isTablet?: boolean;
  isDesktop?: boolean;
  isWeb?: boolean;
}

interface ToastNoticeProps extends ResponsiveProps {
  backgroundColor?: string;
}

interface ToastTextProps {
  color?: string;
  fontSize?: number;
}

export const ToastNotice = styled.View<ToastNoticeProps>`
  flex-direction: row;
  align-items: flex-start;
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 16px;
  background-color: ${({ theme, backgroundColor }) => 
    backgroundColor || theme.colors.surface};
  
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

export const ToastTitle = styled.Text<ToastTextProps>`
  font-size: ${({ fontSize }) => fontSize || 14}px;
  font-weight: 600;
  color: ${({ theme, color }) => color || theme.colors.feedback.warning};
  margin-bottom: 4px;
`;

export const ToastText = styled.Text<ToastTextProps>`
  font-size: ${({ fontSize }) => fontSize || 13}px;
  line-height: 18px;
  color: ${({ theme, color }) => color || theme.colors.feedback.warning};
`;