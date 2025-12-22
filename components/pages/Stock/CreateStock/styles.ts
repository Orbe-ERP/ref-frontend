import styled from "styled-components/native";

export const ScreenContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background || '#fff'};
`;

export const Header = styled.View`
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface || '#f8f8f8'};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.secondary || '#e0e0e0'};
`;

export const Label = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary || '#666'};
  margin-bottom: 4px;
`;