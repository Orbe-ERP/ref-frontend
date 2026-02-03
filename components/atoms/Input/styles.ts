import styled from "styled-components/native";

export const StyledInput = styled.TextInput`
  width: 100%;
  min-height: 48px;

  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};

  padding: 14px;
  font-size: 16px;
  font-weight: 500;

  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 8px;

  margin-bottom: 16px;
`;
