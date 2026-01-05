import styled from "styled-components/native";

interface ResponsiveProps {
  isMobile?: boolean;
  isTablet?: boolean;
  isDesktop?: boolean;
  isWeb?: boolean;
}
export const ActionsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

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
    max-width: 600px; /* Mesma largura para tablet e desktop */
    width: 100%;
    align-self: center;
  ` : ''}
`;

export const FormCard = styled.View<ResponsiveProps>`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 16px;
  gap: 12px;
  
  ${({ isTablet, isDesktop }) => 
    (isTablet || isDesktop) ? `
    width: 100%; /* Agora ocupa 100% do ContentWrapper */
  ` : ''}
`;

export const FormTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Field = styled.View`
  gap: 6px;
`;

export const Label = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const Input = styled.TextInput`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 10px 12px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 16px;
`;

export const SwitchRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Actions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

export const Card = styled.View<ResponsiveProps>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.surface};
  margin-bottom: 8px;
  
  ${({ isTablet, isDesktop }) => 
    (isTablet || isDesktop) ? `
    width: 100%; /* Agora ocupa 100% do ContentWrapper */
  ` : ''}
`;

export const InfoContainer = styled.View`
  flex: 1;
`;

export const Name = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Info = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 2px;
`;

export const ToastNotice = styled.View<ResponsiveProps>`
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;

  flex-direction: row;
  padding: 14px;
  border-radius: 12px;

  background-color: ${({ theme }) => theme.colors.surface};
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.feedback.warning};
  overflow: hidden;
  
  ${({ isTablet, isDesktop }) => 
    (isTablet || isDesktop) ? `
    width: 100%; /* Agora ocupa 100% do ContentWrapper */
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
  ` : ''}
`;

export const ToastIcon = styled.View`
  margin-right: 12px;
  align-items: center;
  justify-content: center;
`;

export const ToastContent = styled.View`
  flex: 1;
  justify-content: center;
`;

export const ToastTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.feedback.warning};
  margin-bottom: 2px;
`;

export const ToastText = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.feedback.warning};
  line-height: 16px;
  opacity: 0.9;
`;

export const ToastIconWrapper = styled.View`
  margin-right: 12px;
  justify-content: center;
`;

export const ToastTextContainer = styled.View`
  flex: 1;
`;

export const ToastMessage = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.feedback.warning};
  font-weight: 500;
`;

export const ToastDescription = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.feedback.warning};
  margin-top: 2px;
  opacity: 0.8;
`;