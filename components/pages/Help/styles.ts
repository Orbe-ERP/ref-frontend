import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const ToastNotice = styled.View`
  flex-direction: row;
  align-items: flex-start;
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 16px;
  background-color: ${({ theme }) => theme.colors.feedback.warning};
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.feedback.warning};
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

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 16px;
  border-radius: 16px;
  gap: 12px;
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
`;

export const Email = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
`;
