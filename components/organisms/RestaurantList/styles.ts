import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  width: 100%;
`;

export const AddButton = styled.TouchableOpacity`
  border-width: 1px;
  border-color: #4B5563;
  border-style: dashed;
  width: 100%;
  padding: 15px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;

export const AddButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
  margin-top: 8px;
`;
