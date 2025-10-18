import styled from "styled-components/native";

export const Category = styled.View`
  margin-bottom: 12px;
`;

export const Header = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
`;

export const CategoryText = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Products = styled.View`
  margin-top: 10px;
`;