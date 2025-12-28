import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 24px;
`;

export const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const StatusContainer = styled.View`
  align-items: center;
  max-width: 400px;
`;

export const SuccessIcon = styled.View`
  margin-bottom: 24px;
`;

export const ErrorIcon = styled.View`
  margin-bottom: 24px;
`;

export const StatusTitle = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin-bottom: 12px;
`;

export const StatusDescription = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  line-height: 24px;
  margin-bottom: 32px;
`;

export const RedirectText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.muted};
  margin-top: 20px;
`;

export const SecurityInfo = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
  padding: 12px 16px;
  background-color: ${({ theme }) => `${theme.colors.feedback.success}15`};
  border-radius: 8px;
`;

export const SecurityText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.feedback.success};
  font-weight: 500;
`;

export const ButtonGroup = styled.View`
  width: 100%;
  gap: 12px;
  margin-top: 32px;
`;

export const RetryButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
  padding: 16px;
  align-items: center;
`;

export const RetryButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.surface};
  font-size: 16px;
  font-weight: 600;
`;

export const HomeButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.overlay};
  border-radius: 12px;
  padding: 16px;
  align-items: center;
`;

export const HomeButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 16px;
  font-weight: 600;
`;

export const PlanButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.accent};
  border-radius: 12px;
  padding: 16px;
  align-items: center;
  margin-top: 8px;
`;

export const PlanButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.surface};
  font-size: 16px;
  font-weight: 600;
`;