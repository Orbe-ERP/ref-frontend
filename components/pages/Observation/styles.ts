import styled from "styled-components/native";

export const ScreenContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 24px;
`;

export const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ItemInfo = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary || "#666"};
`;

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surface || "#fff"};
  padding: 16px;
  margin: 8px 16px;
  border-radius: 12px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
`;

export const EmptyText = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text.secondary || "#666"};
  margin-top: 16px;
  text-align: center;
`;
export const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
`;

export const TabText = styled.Text<{ active: boolean }>`
  font-size: 14px;
  font-weight: ${({ active }) => (active ? "bold" : "500")};
  color: ${({ active, theme }) =>
    active ? theme.colors.surface : theme.colors.text.secondary};
`;

export const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: 500;
`;
export const EmptySubtext = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary || "#666"};
  margin-top: 8px;
  text-align: center;
`;

export const ItemName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary || "#333"};
  margin-bottom: 4px;
`;
export const AddButtonWrapper = styled.View`
  margin-left: 8px;
  height: 44px;
  width: 44px;
  justify-content: center;
  align-items: center;
  margin-top: -18px;
`;

export const ObservationItem = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ObservationText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 16px;
  font-weight: bold;
`;

export const ListEmptyText = styled.Text`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 20px;
  font-size: 14px;
`;
