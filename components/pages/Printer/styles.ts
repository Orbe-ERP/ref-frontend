import styled from "styled-components/native";

/* ===== Container ===== */

export const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
`;

/* ===== Formulário ===== */

export const FormCard = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 16px;
  gap: 12px;
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

export const Card = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.surface};
  margin-bottom: 4px;
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
`;

export const ToastNotice = styled.View`
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
`;

export const ToastIcon = styled.View`
  margin-right: 12px;
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
  color: ${({ theme }) => theme.colors.feedback.warning};
`;
