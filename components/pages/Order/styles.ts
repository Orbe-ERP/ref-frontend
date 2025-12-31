import styled from "styled-components/native";

// Interface para props responsivas
interface ResponsiveProps {
  isMobile?: boolean;
  isTablet?: boolean;
  isDesktop?: boolean;
  isWeb?: boolean;
}

export const Container = styled.View<ResponsiveProps>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
  
  ${({ isWeb, isTablet, isDesktop }) => 
    (isTablet || isDesktop) && isWeb ? `
    align-items: center;
  ` : ''}
`;

export const ContentWrapper = styled.View<ResponsiveProps>`
  ${({ isTablet, isDesktop }) => 
    (isTablet || isDesktop) ? `
    max-width: 600px;
    width: 100%;
    align-self: center;
  ` : ''}
`;

export const Footer = styled.View<ResponsiveProps>`
  padding: 20px;
  
  ${({ isTablet, isDesktop }) => 
    (isTablet || isDesktop) ? `
    align-items: center;
  ` : ''}
`;

export const CartContainer = styled.TouchableOpacity`
  margin-right: 15px;
  position: relative;
`;

export const HeaderRightContainer = styled.View`
  flex-direction: row; 
  align-items: center;
  gap: 10px; 
`;

export const Badge = styled.View`
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: red;
  border-radius: 10px;
  width: 18px;
  height: 18px;
  justify-content: center;
  align-items: center;
`;

export const BadgeText = styled.Text`
  font-size: 10px;
  font-weight: bold;
  color: white;
`;