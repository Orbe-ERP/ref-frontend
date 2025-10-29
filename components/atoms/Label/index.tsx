import styled from "styled-components/native";

const Label = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 16px;
`;

export default Label;
