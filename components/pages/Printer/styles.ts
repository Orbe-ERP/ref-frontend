// styles.ts
import styled from "styled-components/native";

interface ResponsiveProps {
  isMobile?: boolean;
  isTablet?: boolean;
  isDesktop?: boolean;
  isWeb?: boolean;
}

// Container principal - CORREÇÃO AQUI
export const Container = styled.View<ResponsiveProps>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  
  ${({ isWeb, isTablet, isDesktop }) => 
    (isTablet || isDesktop) && isWeb ? `
    align-items: center;
  ` : ''}
`;

// ContentWrapper - CORREÇÃO AQUI
export const ContentWrapper = styled.View<ResponsiveProps>`
  flex: 1;
  padding: ${({ isTablet, isDesktop }) => 
    isDesktop ? '24px' : 
    isTablet ? '20px' : 
    '16px'};
  
  ${({ isTablet, isDesktop }) => 
    (isTablet || isDesktop) ? `
    max-width: 800px;
    width: 100%;
    align-self: center;
  ` : ''}
`;

// Remova ou altere o ToastNotice - não use position: absolute
export const ToastNotice = styled.View<ResponsiveProps>`
  flex-direction: row;
  align-items: flex-start;
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 16px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.feedback.warning};
  
  ${({ isTablet, isDesktop }) => 
    (isTablet || isDesktop) ? `
    width: 100%;
  ` : ''}
`;

// Mantenha o restante dos estilos como estão...
export const ActionsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const FormCard = styled.View<ResponsiveProps>`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 16px;
  gap: 12px;
  
  ${({ isTablet, isDesktop }) => 
    (isTablet || isDesktop) ? `
    width: 100%;
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
    width: 100%;
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

export const SectionTitle = styled.Text<ResponsiveProps>`
  font-size: ${({ isTablet, isDesktop }) => 
    isDesktop ? 18 : isTablet ? 16 : 14}px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 16px;
  margin-top: 24px;
`;

export const HelpText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 4px;
`;

export const DefaultBadge = styled.Text`
  font-size: 11px;
  background-color: ${({ theme }) => theme.colors.feedback.success + "20"};
  color: ${({ theme }) => theme.colors.feedback.success};
  padding-horizontal: 8px;
  padding-vertical: 2px;
  border-radius: 12px;
  margin-left: 8px;
`;

export const Status = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

export const StatusText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-left: 4px;
`;

export const EmptyState = styled.View`
  align-items: center;
  padding: 40px 20px;
`;

export const EmptyText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-top: 16px;
  text-align: center;
`;

export const EmptySubtext = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 8px;
  text-align: center;
  max-width: 300px;
`;

export const Spacer = styled.View`
  height: 60px;
`;

export const IpInstructions = styled.View`
  margin-top: 16px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const InstructionsTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 12px;
`;

export const InstructionItem = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
`;

export const InstructionBullet = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  margin-right: 8px;
  font-weight: 600;
`;

export const InstructionText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  flex: 1;
`;

export const InstructionHighlight = styled.Text`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const InstructionCode = styled.Text`
  font-family: monospace;
  background-color: ${({ theme }) => theme.colors.surface + '80'};
  padding: 2px 6px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const CloseHelpButton = styled.TouchableOpacity`
  margin-top: 16px;
  align-self: flex-end;
`;

export const CloseHelpText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
`;

export const HelpButton = styled.TouchableOpacity`
  margin-top: 6px;
  padding: 4px 0;
`;

export const HelpButtonText = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
`;

export const Actions = styled.View<ResponsiveProps>`
  flex-direction: ${({ isTablet, isDesktop }) => 
    (isTablet || isDesktop) ? 'row' : 'column'};
  gap: 12px;
  margin-top: 8px;
`;