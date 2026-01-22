import styled from "styled-components/native";

export const StyledInput = styled.TextInput`
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  width: 100%;
  padding: 12px;
  font-weight: bold;
  border-radius: 8px;
  font-size: 16px;
  border-width: 1;
  border-color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 20px;
`;
