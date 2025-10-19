import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
`;

export const Footer = styled.View`
  padding: 20px;
`;

export const CartContainer = styled.TouchableOpacity`
  margin-right: 15px;
`;

export const HeaderRightContainer = styled.View`
flex-direction: row; 
align-items: center;
 gap: 10px; 

` 
export const Badge = styled.View`
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: red;
  border-radius: 10px;
  width: 18px;
  height: 18px;
  justify-content: center;
  align-items: center;

`;

export const BadgeText = styled.Text`
  font-size: 10px;
  font-weight: bold;
`;
