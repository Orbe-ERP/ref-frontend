
import styled from "styled-components/native";

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding-vertical: 20px;
  padding-horizontal: 15px;
  border-bottom-width: 1;
  border-bottom-color: ${({ theme }) => theme.colors.secondary};
`;
