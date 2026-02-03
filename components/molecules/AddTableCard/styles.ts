import styled from "styled-components/native";

export const AddButton = styled.TouchableOpacity`
  border-width: 1;
  border-color: ${({ theme }) => theme.colors.primary};
  border-style: dashed;
  width: 120;
  height: 120;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.06);
  shadow-color: ${({ theme }) => theme.colors.text.primary};
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
