import styled from "styled-components/native";

export const ScrollView = styled.ScrollView`
  flex: 1;
  background-color: #041224;
`;

export const View = styled.View`
  padding: 40px;
  align-items: center;
`;

export const Text = styled.Text`
  color: #fff;
  font-size: 16px;
  margin-top: 16px;
`;

export const ErrorText = styled.Text`
  color: #ff4d4f;
  font-size: 16px;
  margin-top: 16px;
`;

export const SummaryCard = styled.View`
  background-color: #0A2647;
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
  color: #45B7D1;
  font-size: 16px;
  font-weight: 500;
`;

export const SummaryValue = styled.Text`
  color: #fff;
  font-size: 32px;
  font-weight: bold;
  margin-top: 6px;
`;