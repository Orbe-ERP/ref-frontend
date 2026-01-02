import styled from "styled-components/native";


export const ScreenContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 24px;
  gap: 15px;
`;
