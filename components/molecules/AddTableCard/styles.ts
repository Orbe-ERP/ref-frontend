import styled from "styled-components/native";

export const AddButton = styled.TouchableOpacity`
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.secondary};
  border-style: dashed;
  width: 45%;
  aspect-ratio: 1;
  justify-content: center;
  align-items: center;
  margin: 0;
  border-radius: 12px;
`;

export const AddLabel = styled.Text`
  text-transform: capitalize;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 20px;
  font-weight: bold;
  text-align: center;
`;
