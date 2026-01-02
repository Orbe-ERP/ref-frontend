import styled from "styled-components/native";


export const ScreenContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 24px;
`;

export const Grid = styled.View<{ isMobile: boolean }>`
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: ${({ isMobile }) =>
    isMobile ? "center" : "center"};
  gap: 16px;
`;

export const CardWrapper = styled.View<{ isMobile: boolean }>`
display: flex;
align-items: center;
justify-content: center;
`;
