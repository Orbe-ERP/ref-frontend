import styled from "styled-components/native";

export const AddButton = styled.TouchableOpacity`
  border-width: 2;
  border-color: ${({ theme }) => theme.colors.primary};
  border-style: dashed;
  width: 160;
  height: 160;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.surface};
  shadow-color: ${({ theme }) => theme.colors.text.primary};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 6;
`;

export const AddLabel = styled.Text`
  text-transform: capitalize;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
  letter-spacing: 0.5px;
`;