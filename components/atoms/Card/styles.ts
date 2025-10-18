import styled from "styled-components/native";

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
  border-radius: 12px;
  shadow-color: ${({ theme }) => theme.colors.surface};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 4;
  margin-vertical: 8px;
  margin-horizontal: 4px;
`;
