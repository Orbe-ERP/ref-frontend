import styled from "styled-components/native";

export const Card = styled.TouchableOpacity`
  background-color: #041224;
  border-radius: 12px;
  flex: 1;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #038082;
  shadow-color: #038082;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
  elevation: 5;
`;

export const CardLabel = styled.Text`
  color: white;
  margin-top: 8px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;
