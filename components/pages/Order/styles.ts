import styled from "styled-components/native";

interface ResponsiveProps {
  isMobile?: boolean;
  isTablet?: boolean;
  isDesktop?: boolean;
  isWeb?: boolean;
}

export const ScrollContent = styled.ScrollView<ResponsiveProps>`
  flex: 1;

  width: 100vw;
`;

export const Container = styled.View<ResponsiveProps>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
`;

export const ContentWrapper = styled.View<ResponsiveProps>`
  flex: 1;
  width: 100vw;
`;

export const Footer = styled.View<ResponsiveProps>`

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
