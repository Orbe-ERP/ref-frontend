import styled from "styled-components/native";
import { ScrollView } from "react-native";

export const ScreenContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 24px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding-vertical: 20px;
  padding-horizontal: 15px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.secondary};
`;

export const ItemRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-vertical: 16px;
  padding-horizontal: 12px;
  margin-vertical: 4px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
`;

export const ItemText = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 16px;
  margin-left: 12px;
`;

export const Footer = styled.View`
  align-items: center;
`;

export const ConfigScroll = styled(ScrollView)``;

export const ContentWrapper = styled.View<{ isMobile: boolean }>`
  width: 100%;
  align-self: center;
  max-width: ${({ isMobile }) => (isMobile ? "100%" : "520px")};
`;

export const ScaleWrapper = styled.View<{ scale: number }>`
  transform: ${({ scale }) => `scale(${scale})`};
  transform-origin: top center;
`;
