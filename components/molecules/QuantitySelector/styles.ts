import styled from "styled-components/native";

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const CircleButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: #038082;
  align-items: center;
  justify-content: center;
`;

export const QuantityText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 12px;
`;
