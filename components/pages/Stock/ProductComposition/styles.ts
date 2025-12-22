import styled from "styled-components/native";

export const ScreenContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background || '#fff'};
  padding: 16px;
`;

export const Header = styled.View`
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface || '#f8f8f8'};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.secondary || '#e0e0e0'};
`;

export const FilterContainer = styled.View`
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.surface || '#f8f8f8'};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.secondary || '#e0e0e0'};
`;

export const Label = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary || '#666'};
  margin-bottom: 8px;
`;

export const ProductHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.surface || '#f8f8f8'};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.secondary || '#e0e0e0'};
`;

export const ProductTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary || '#333'};
`;

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surface || '#fff'};
  padding: 16px;
  margin: 8px 16px;
  border-radius: 8px;
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

export const PreviewContainer = styled.View`
  margin-top: 8px;
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.feedback.success + '10'};
  border-radius: 6px;
  border-left-width: 3px;
  border-left-color: ${({ theme }) => theme.colors.feedback.success};
`;

export const ItemDetailContainer = styled.View`
  margin-bottom: 20px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.secondary + '30'};
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-top: auto;
  padding-top: 16px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.secondary + '20'};
`;

export const TipText = styled.Text`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin-top: 24px;
`;