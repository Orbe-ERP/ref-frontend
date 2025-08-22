import styled from "styled-components/native";

export const Button = styled.TouchableOpacity`
  background-color: #ea5a82; /* mantém a paleta usada no chart */
  padding: 8px 12px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  min-width: 70px;
`;

export const ButtonLabel = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
`;
