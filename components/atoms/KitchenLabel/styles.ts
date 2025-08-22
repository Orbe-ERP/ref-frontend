import styled from "styled-components/native";

export const StyledKitchenLabel = styled.Text<{ color: string }>`
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 12px;
  background-color: ${({ color }: { color: string }) => color};
`;
