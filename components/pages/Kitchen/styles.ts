import styled from "styled-components/native";
import { Animated } from "react-native";
import { Picker } from "@react-native-picker/picker";

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px 20px;
`;

export const TableCard = styled(Animated.View)`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 20px;
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
`;

export const PickerContainer = styled.View`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 15px;
  overflow: hidden;
  min-height: 50px;
  justify-content: center;
`;

export const StyledPicker = styled(Picker<string>)`
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: transparent;
  height: 50px;
`;

export const TableName = styled.Text`
  font-size: 22px;
  color: #fff;
  font-weight: 700;
  margin-bottom: 12px;
  text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.5);
`;

export const KitchenCard = styled.View`
  background-color: ${(props) => props.color || "#A0AEC0"};
  padding: 10px 14px;
  border-radius: 12px;
  margin-bottom: 12px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
`;

export const KitchenName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};

`;

export const EmptyText = styled.Text`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 16px;
  margin-top: 24px;
  text-align: center;
  font-style: italic;
`;