import styled from "styled-components/native";

export const AddButton = styled.TouchableOpacity`
  border-width: 1px;
  border-color: #4b5563;
  border-style: dashed;
  width: 45%;
  aspect-ratio: 1;
  margin 0;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
`;

export const AddLabel = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  margin-top: 8px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;
