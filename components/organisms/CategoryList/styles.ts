import styled from "styled-components/native";

export const Container = styled.View`
  display: flex;
  align-items: center;
`;

export const Category = styled.View`
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  width: 90vw;
  shadow-radius: 4px;
  elevation: 3;
`;

export const Header = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 14px;
  padding-horizontal: 18px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const CategoryText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  text-transform: capitalize;
  letter-spacing: 0.3px;
`;

export const Products = styled.View`
  padding: 10px 14px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
  gap: 10px;
`;
