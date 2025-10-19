import styled from "styled-components/native";

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const CircleButton = styled.TouchableOpacity`
  width: 38px;
  height: 38px;
  border-radius: 19px;
  background-color: ${({ theme }) => theme.colors.surface || "#2A2A2A"};
  align-items: center;
  justify-content: center;
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.colors.primary || "#00C1B3"};
  shadow-color: #000;
  shadow-opacity: 0.25;
  shadow-radius: 3px;
  shadow-offset: 0px 2px;
  elevation: 3;
`;

export const QuantityText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary || "#FFF"};
  margin: 0 16px;
  min-width: 28px;
  text-align: center;
`;
