import styled from "styled-components/native";
import { ScrollView } from "react-native";

export interface ResponsiveProps {
  isMobile?: boolean;
  isTablet?: boolean;
  isDesktop?: boolean;
  isWeb?: boolean;
}

export const ScreenContainer = styled.View<ResponsiveProps>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 24px;
  
  ${({ isTablet, isDesktop, isWeb }) => 
    (isTablet || isDesktop) && isWeb ? `
    align-items: center;
  ` : ''}
`;

export const ContentWrapper = styled.View<ResponsiveProps>`
  ${({ isTablet, isDesktop }) => 
    (isTablet || isDesktop) ? `
    max-width: ${isTablet ? 900 : 1200}px;
    width: 100%;
    align-self: center;
  ` : ''}
`;

export const CategoriesGrid = styled.View<ResponsiveProps>`
  ${({ isTablet, isDesktop }) => 
    (isTablet || isDesktop) ? `
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: flex-start;
  ` : ''}
`;

export const CardContainer = styled.View<ResponsiveProps>`
  ${({ isTablet, isDesktop }) => 
    (isTablet || isDesktop) ? `
    width: ${isDesktop ? 'calc(25% - 15px)' : 'calc(33.333% - 14px)'};
    min-height: 180px;
    align-items: center;
    justify-content: center;
  ` : ''}
`;

export const ScrollContainer = styled(ScrollView)``;