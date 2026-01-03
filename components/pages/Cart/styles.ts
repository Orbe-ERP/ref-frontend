import styled from "styled-components/native";

interface ResponsiveProps {
  isMobile?: boolean;
  isTablet?: boolean;
  isDesktop?: boolean;
  isWeb?: boolean;
  isWide?: boolean;
}

export const Container = styled.View<ResponsiveProps>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;

  ${({ isWeb, isTablet, isDesktop }) =>
    (isTablet || isDesktop) && isWeb
      ? `
    align-items: center;
  `
      : ""}
`;

export const ContentWrapper = styled.View<ResponsiveProps>`
  flex: 1;
  ${({ isTablet, isDesktop }) =>
    isTablet || isDesktop
      ? `
    max-width: 600px;
    width: 100%;
    align-self: center;
  `
      : ""}
`;

export const Card = styled.View<ResponsiveProps>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 18px;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
  elevation: 3;

  ${({ isWide }) =>
    isWide
      ? `
    width: 100%;
  `
      : ""}
`;

export const Label = styled.Text`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
`;

export const Input = styled.TextInput<ResponsiveProps>`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 16px;
  font-weight: bold;
  font-size: 15px;
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.colors.border};

  ${({ isWide }) =>
    isWide
      ? `
    width: 100%;
  `
      : ""}
`;

export const Row = styled.View<ResponsiveProps>`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;
  margin-bottom: 18px;

  ${({ isWide }) =>
    isWide
      ? `
    justify-content: center;
  `
      : ""}
`;

export const CheckboxContainer = styled.View`
  margin-bottom: 12px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

export const CheckboxItem = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : theme.colors.surface};
  border-width: 1.5px;
  border-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : theme.colors.border};
  border-radius: 8px;
  padding-vertical: 8px;
  padding-horizontal: 12px;
  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-radius: 3px;
  shadow-offset: 0px 1px;
  elevation: 2;
`;

export const CheckboxText = styled.Text<{ selected?: boolean }>`
  color: ${({ selected, theme }) =>
    selected ? theme.colors.text.primary : theme.colors.text.secondary};
  font-size: 14px;
`;

export const EmptyText = styled.Text<ResponsiveProps>`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 16px;
  text-align: center;
  margin-top: 80px;
  opacity: 0.8;

  ${({ isWide }) =>
    isWide
      ? `
    margin-top: 120px;
    font-size: 18px;
  `
      : ""}
`;

export const ButtonContainer = styled.View<ResponsiveProps>`
  ${({ isWide }) =>
    isWide
      ? `
    align-items: center;
    margin-top: 20px;
  `
      : ""}
`;
