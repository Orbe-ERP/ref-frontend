import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const CategoryCard = styled.View`
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const CategoryTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 12px;
`;

export const ModifierRow = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.text.secondary}30;
`;

export const ModifierName = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ModifierPrice = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;
