import styled from "styled-components/native";

export const ScrollView = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const View = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 10px;
  align-items: center;
`;

export const Text = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 16px;
  margin-top: 16px;
`;

export const ErrorText = styled.Text`
  color: #ff4d4f;
  font-size: 16px;
  margin-top: 16px;
`;

export const SummaryCard = styled.View`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
  padding: 20px;
  margin-horizontal: 16px;
  margin-top: 16px;
  margin-bottom: 8px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 3;
`;

export const SummaryTitle = styled.Text`
  color: ${({ theme }) => theme.colors.surface};
  font-size: 16px;
  font-weight: 500;
`;

export const SummaryValue = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 32px;
  font-weight: bold;
  margin-top: 6px;
`;
