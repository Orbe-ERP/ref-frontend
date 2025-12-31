import styled from "styled-components/native";

type Status = "ok" | "warning" | "critical";

const statusToFeedback = {
  ok: "success",
  warning: "warning",
  critical: "error",
} as const;

export const ScreenContainer = styled.ScrollView`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
  margin-bottom: 16px;
`;

export const StockCard = styled.View<{ status: Status }>`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  background-color: ${({ theme, status }) => `${theme.colors.feedback[statusToFeedback[status]]}22`};
`;

export const InfoContainer = styled.View`
  flex: 1;
`;

export const StockName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const StockInfo = styled.Text`
  margin-top: 4px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const StockMinimum = styled.Text`
  margin-top: 2px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const Actions = styled.View`
  align-items: center;
  gap: 12px;
`;

export const ActionButton = styled.TouchableOpacity`
  padding: 8px;
`;

export const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const EmptyText = styled.Text`
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;
