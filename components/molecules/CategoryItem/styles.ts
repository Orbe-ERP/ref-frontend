import styled from "styled-components/native";

export const Container = styled.View`
  padding: 12px;
  background-color: #0d1b2a;
  margin-bottom: 8px;
  border-radius: 8px;
`;

export const OptionRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const SubOptions = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

export const QuantityText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: white;
  margin: 0 10px;
`;

export const QuantityButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: #1b263b;
  align-items: center;
  justify-content: center;
`;

export const AddButton = styled.TouchableOpacity`
  margin-left: 12px;
  background-color: #2a4b7c;
  padding: 8px 12px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
`;
