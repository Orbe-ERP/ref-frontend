import styled from "styled-components/native";

export const StyledKitchenLabel = styled.Text<{ color: string }>`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 6px 12px;
  border-radius: 999px;
  color: ${({ color }) => color};
  background-color: ${({ color }) => `${color}20`};
  border-width: 1px;
  border-color: ${({ color }) => `${color}60`};

  overflow: hidden;
`;
