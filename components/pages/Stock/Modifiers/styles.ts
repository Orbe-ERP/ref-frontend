import styled from "styled-components/native";

export const ScreenContainer = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px;
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.secondary || '#e0e0e0'};
`;

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
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

export const ItemName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary || '#333'};
  margin-bottom: 4px;
`;

export const ItemInfo = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary || '#666'};
  margin-bottom: 2px;
`;

export const ActionsContainer = styled.View`
  flex-direction: row;
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
  color: ${({ theme }) => theme.colors.text.secondary || '#666'};
  margin-top: 16px;
  text-align: center;
`;

export const EmptySubtext = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary || '#666'};
  margin-top: 8px;
  text-align: center;
`;

export const Label = styled.Text`
  font-size: 14px;
  margin-bottom: 4px;
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.text.primary};
`;
