import styled from 'styled-components/native';

export const PaginationContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 8px;
  padding: 8px 16px;
  background-color: transparent;
`;

export const PageButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.colors.surface};
  justify-content: center;
  align-items: center;
  
  /* Sombra suave */
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;

  /* Borda sutil opcional */
  border: 1px solid ${({ theme }) => theme.colors.border || '#f0f0f0'};
`;

export const PageIndicatorContainer = styled.View`
  flex-direction: row;
  align-items: baseline;
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 8px 16px;
  border-radius: 20px;
  
  /* Sombra sutil apenas para destacar do fundo */
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
`;

export const CurrentPage = styled.Text`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  margin-right: 4px;
`;

export const TotalPages = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
`;