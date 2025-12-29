import styled from "styled-components/native";

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.surface || "#1E1E1E"};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 14px;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
  elevation: 3;
`;

export const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const Radio = styled.TouchableOpacity<{ selected: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  border-width: 2;
  border-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary || "#00C1B3" : "#777"};
  align-items: center;
  justify-content: center;
  background-color: ${({ selected, theme }) =>
    selected ? `${theme.colors.primary}33` : "transparent"};
  transition: all 0.2s;
`;

export const Dot = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.primary || "#00C1B3"};
`;

export const ProductText = styled.Text`
  margin-left: 12px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary || "#FFF"};
`;

export const Actions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 12px;
  align-items: center;
`;

export const AddButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary || "#00C1B3"};
  padding: 12px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
  elevation: 4;
`;

export const Space = styled.View`
  height: 15;
`;
