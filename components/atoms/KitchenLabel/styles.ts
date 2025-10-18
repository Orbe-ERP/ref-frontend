import styled from "styled-components/native";

export const StyledKitchenLabel = styled.Text<{ color: string }>`
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;
