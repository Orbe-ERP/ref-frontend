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
  height: 100vh;
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

export const StockRow = styled.View<{ status: "ok" | "warning" | "critical" }>`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};

  background-color: ${({ status, theme }) =>
    status === "critical"
      ? theme.colors.feedback.error + "10"
      : status === "warning"
      ? theme.colors.feedback.warning + "10"
      : "transparent"};
`;

export const ColumnName = styled.Text`
  flex: 2;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ColumnQty = styled.Text`
  flex: 1;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const ColumnMin = styled.Text`
  flex: 1;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const RowActions = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;
