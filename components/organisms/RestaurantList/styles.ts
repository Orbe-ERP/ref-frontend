import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  width: 100%;
`;

export const AddButton = styled.TouchableOpacity`
  border-width: 2;
  border-color: ${({ theme }) => theme.colors.primary};
  border-style: dashed;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 30px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;

export const AddButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 20px;
  font-weight: bold;
  margin-top: 8px;
`;
